// SAM.gov API Integration
// Reference: https://open.gsa.gov/api/get-opportunities-public-api/

export interface SamApiParams {
  limit?: number;
  offset?: number;
  postedFrom?: string;
  postedTo?: string;
  keyword?: string;
  noticeType?: string;
  naicsCode?: string;
  organizationId?: string;
  active?: boolean;
  daysBeforeClose?: number;
}

export interface SamOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber: string;
  fullParentPathName: string;
  fullParentPathCode: string;
  postedDate: string;
  type: string;
  baseType: string;
  archiveType: string;
  archiveDate: string;
  typeOfSetAsideDescription: string;
  typeOfSetAside: string;
  responseDeadLine: string;
  naicsCode: string;
  naicsCodes: string[];
  classificationCode: string;
  active: string;
  award?: {
    date: string;
    number: string;
    amount: string;
    awardee: {
      name: string;
      location: {
        streetAddress: string;
        city: { name: string };
        state: { code: string };
        zip: string;
        country: { code: string };
      };
    };
  };
  pointOfContact?: {
    fax: string;
    type: string;
    email: string;
    phone: string;
    title: string;
    fullName: string;
  }[];
  description: string;
  organizationHierarchy: {
    name: string;
    code: string;
    type: string;
  }[];
  officeAddress: {
    city: string;
    state: string;
    zipcode: string;
    country_code: string;
  };
  placeOfPerformance: {
    street_address: string;
    city: { code: string; name: string };
    state: { code: string; name: string };
    zip: string;
    country: { code: string; name: string };
  };
  additionalInfoLink: string;
  uiLink: string;
  links: { rel: string; href: string }[];
  resourceLinks?: string[];
}

export interface SamApiResponse {
  totalRecords: number;
  limit: number;
  offset: number;
  opportunitiesData: SamOpportunity[];
}

export class SamApiClient {
  private apiKey: string;
  private baseUrl = 'https://api.sam.gov/opportunities/v2/search';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchOpportunities(params: SamApiParams): Promise<SamApiResponse> {
    const searchParams = new URLSearchParams({
      api_key: this.apiKey,
      limit: String(params.limit || 10),
      offset: String(params.offset || 0),
    });

    if (params.postedFrom) searchParams.append('postedFrom', params.postedFrom);
    if (params.postedTo) searchParams.append('postedTo', params.postedTo);
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.noticeType) searchParams.append('noticeType', params.noticeType);
    if (params.naicsCode) searchParams.append('naicsCode', params.naicsCode);
    if (params.active !== undefined) searchParams.append('active', String(params.active));
    if (params.daysBeforeClose) searchParams.append('daysBeforeClose', String(params.daysBeforeClose));

    const res = await fetch(`${this.baseUrl}?${searchParams.toString()}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`SAM.gov API error ${res.status}: ${errorText}`);
    }
    return res.json();
  }

  // USFK-specific search (Korea-focused)
  async searchUsfkOpportunities(params: SamApiParams = {}): Promise<SamApiResponse> {
    return this.searchOpportunities({
      ...params,
      keyword: params.keyword
        ? `${params.keyword} USFK Korea`
        : 'USFK OR "Korea" OR "Camp Humphreys" OR "Osan" OR "Kunsan" OR "8th Army"',
    });
  }
}

// Convert SAM.gov API response to our Bid type
import { Bid, NoticeType, BidStatus } from '@/types';

function mapNoticeType(type: string): NoticeType {
  const map: Record<string, NoticeType> = {
    'p': 'Presolicitation',
    'o': 'Solicitation',
    'k': 'Combined Synopsis/Solicitation',
    'r': 'Sources Sought',
    's': 'Special Notice',
    'a': 'Award Notice',
    'u': 'Special Notice',
    'i': 'Special Notice',
    'j': 'Special Notice',
    'm': 'Modification/Amendment',
  };
  return (map[type?.toLowerCase()] as NoticeType) || 'Solicitation';
}

function mapStatus(opportunity: SamOpportunity): BidStatus {
  if (opportunity.award) return 'awarded';
  if (opportunity.active === 'No') return 'closed';
  const type = opportunity.type?.toLowerCase();
  if (type === 'p') return 'presolicitation';
  if (type === 'm') return 'modified';
  return 'active';
}

export function mapSamOpportunityToBid(op: SamOpportunity): Bid {
  const agency = op.organizationHierarchy?.[0]?.name || op.fullParentPathName?.split('.')[0] || 'Unknown Agency';
  const office = op.organizationHierarchy?.[1]?.name || op.fullParentPathName?.split('.')[1] || '';
  const poc = op.pointOfContact?.[0];

  return {
    id: op.noticeId,
    noticeId: op.noticeId,
    title: op.title,
    type: mapNoticeType(op.type),
    status: mapStatus(op),
    postedDate: op.postedDate,
    responseDeadline: op.responseDeadLine || op.archiveDate,
    agency,
    office,
    location: op.placeOfPerformance
      ? `${op.placeOfPerformance.city?.name || ''}, ${op.placeOfPerformance.country?.name || ''}`
      : '',
    naicsCode: op.naicsCode || '',
    naicsDescription: '',
    setAside: op.typeOfSetAsideDescription,
    estimatedValue: undefined,
    awardAmount: op.award?.amount ? parseFloat(op.award.amount) : undefined,
    awardee: op.award?.awardee?.name,
    awardDate: op.award?.date,
    description: op.description || '',
    contactName: poc?.fullName,
    contactEmail: poc?.email,
    contactPhone: poc?.phone,
    solicitationNumber: op.solicitationNumber,
    placeOfPerformance: {
      city: op.placeOfPerformance?.city?.name || '',
      state: op.placeOfPerformance?.state?.name || '',
      country: op.placeOfPerformance?.country?.name || 'South Korea',
    },
    isUsfk: /USFK|Korea|Humphreys|Osan|Kunsan|Camp/i.test(op.title + op.description),
    keywords: [],
  };
}
