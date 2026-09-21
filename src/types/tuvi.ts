export type GioiTinh = 'Nam' | 'Nữ';

export interface NgayThangNamSinh {
  ngayDuong: number;
  thangDuong: number;
  namDuong: number;
  gioSinhVal: string; // '0_0', '1', '2', ..., '11', '0_23'
}

export type ServiceTier = 'free' | 'pro';

export interface DuLieuDuongSo extends NgayThangNamSinh {
  hoTen: string;
  gioiTinh: GioiTinh;
  thongTinThem?: string;
  chieuCao?: number;
  canNang?: number;
  anhMat?: string; // base64
  anhTay?: string; // base64
  tier?: ServiceTier;
}

export interface AmLichResult {
  ngayAm: number;
  thangAm: number;
  namAm: number;
  thangAmGoc: number;
  isLeap: boolean;
}

export interface SaoInfo {
  ten: string;
  dacHam?: string; // B, Đ, M, V, H
  loai: 'chinh' | 'tot' | 'xau';
  color?: string;
}

export interface CungLaSo {
  cungId: number; // 0..11 (0=Tý, 1=Sửu, ..., 11=Hợi)
  cungName: string; // Mệnh, Phụ Mẫu, Phúc Đức...
  isThan: boolean;
  canChi: string; // G. Tý, Ấ. Sửu...
  can: string;
  chi: string;
  daiVan: number;
  tieuVan: string;
  nguyetVan: string;
  truongSinh: string;
  chinhTinh: SaoInfo[];
  phuTinhTot: SaoInfo[];
  phuTinhXau: SaoInfo[];
}

export interface LaSoData {
  duongSo: DuLieuDuongSo;
  amLich: AmLichResult;
  namCanChi: string;
  thangCanChi?: string;
  ngayCanChi?: string;
  gioCanChi?: string;
  canNamIdx: number;
  chiNamIdx: number;
  amDuongTxt: string;
  thuanNghichLy: string;
  banMenh: string;
  napAmMenh?: string;
  tenCuc: string;
  sinhKhac: string;
  thanCuName?: string;
  menhChu: string;
  thanChu: string;
  menhCungIdx: number;
  thanCungIdx: number;
  tuanGoc: number;
  trietGoc: number;
  namXem: number;
  namXemCanChi: string;
  tuoiAmXem: number;
  tier?: ServiceTier;
  quota?: QuestionsQuota;
  cungs: CungLaSo[];
}

export interface ChatMessage {
  q: string;
  a: string;
  isError?: boolean;
  type?: 'basic' | 'vip';
}

export interface QuestionsQuota {
  basicAllowed: number;
  proAllowed: number;
}
