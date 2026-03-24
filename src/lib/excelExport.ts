import * as XLSX from 'xlsx';
import { Bid, AwardData, CompetitorData } from '@/types';

function formatCurrency(value?: number) {
  if (!value) return '-';
  return `$${value.toLocaleString()}`;
}

export function exportBidsToExcel(bids: Bid[], filename = 'USFK_입찰공고') {
  const data = bids.map((bid) => ({
    '공고번호': bid.solicitationNumber,
    '공고제목': bid.title,
    '공고유형': bid.type,
    '상태': bid.status,
    '기관': bid.agency,
    '부서': bid.office,
    'NAICS코드': bid.naicsCode,
    'NAICS설명': bid.naicsDescription,
    '추정금액': formatCurrency(bid.estimatedValue),
    '낙찰금액': formatCurrency(bid.awardAmount),
    '낙찰업체': bid.awardee || '-',
    '게시일': bid.postedDate,
    '마감일': bid.responseDeadline,
    '수행지역': `${bid.placeOfPerformance.city}, ${bid.placeOfPerformance.country}`,
    '담당자': bid.contactName || '-',
    '담당자이메일': bid.contactEmail || '-',
    'USFK관련': bid.isUsfk ? '예' : '아니오',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '입찰공고');

  // Auto column width
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length * 2, 15),
  }));
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportAwardsToExcel(awards: AwardData[], filename = 'USFK_낙찰현황') {
  const data = awards.map((award) => ({
    '연도': award.year,
    '월': award.month,
    '기관': award.agency,
    '낙찰업체': award.awardee,
    '낙찰금액': formatCurrency(award.amount),
    'NAICS코드': award.naicsCode,
    'NAICS설명': award.naicsDescription,
    '공고명': award.title,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '낙찰현황');
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportCompetitorsToExcel(competitors: CompetitorData[], filename = 'USFK_경쟁사분석') {
  const data = competitors.map((c) => ({
    '업체명': c.name,
    '총 낙찰 건수': c.totalAwards,
    '총 낙찰 금액': formatCurrency(c.totalValue),
    '평균 낙찰 금액': formatCurrency(c.avgValue),
    'NAICS 코드': c.naicsCodes.join(', '),
    '최근 낙찰일': c.recentWin || '-',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '경쟁사분석');
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
