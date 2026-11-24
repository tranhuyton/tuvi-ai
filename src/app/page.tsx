import React from 'react';
import type { Metadata } from 'next';
import TuViWorkspaceClient from '@/components/TuViWorkspaceClient';
import { HOME_FUNNEL_PAGE } from '@/lib/funnelPagesIndex';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.tuvithayton.vn',
  },
};

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': 'https://www.tuvithayton.vn/#service',
      name: 'Tử Vi & Phong Thủy Thầy Tôn — An Sao Tử Vi & Tư Vấn Phong Thủy Thực Chứng',
      url: 'https://www.tuvithayton.vn',
      telephone: '+84935058688',
      email: 'tranhuyton@gmail.com',
      priceRange: '0 VNĐ - 2.000.000 VNĐ',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Khu đô thị Royal City, 72A Nguyễn Trãi, Thanh Xuân',
        addressLocality: 'Hà Nội',
        addressCountry: 'VN',
      },
      founder: { '@id': 'https://www.tuvithayton.vn/#thayton' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Các Gói Dịch Vụ An Sao, Luận Giải Tử Vi, Khóa Học & Tư Vấn Phong Thủy Thầy Tôn',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Gói Khởi Nguyên — An Sao & Bình Giải Tử Vi Miễn Phí',
            description:
              'Lập lá số Tử Vi 108 sao chính xác theo giờ sinh và nhận bài bình giải Khởi Nguyên miễn phí (~1.000 từ) về Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận & Tiểu Vận.',
            price: '0',
            priceCurrency: 'VND',
            url: 'https://www.tuvithayton.vn/',
          },
          {
            '@type': 'Offer',
            name: 'Gói Chuyên Sâu VIP Pro (Kèm Xem Ảnh Mặt, Chỉ Tay & 02 Câu Hỏi VIP)',
            description:
              'Luận giải chuyên sâu (~2.500 từ) mổ xẻ Tứ Trụ Mệnh - Thân - Tài - Quan - Phu Thê, kết hợp soi Diện Tướng khuôn mặt, Thủ Tướng bàn tay (hỗ trợ bổ sung ảnh miễn phí sau khi mở gói), Đại Vận 10 năm, Vận khí 4 mùa và tặng kèm 02 câu hỏi VIP.',
            price: '119000',
            priceCurrency: 'VND',
            url: 'https://www.tuvithayton.vn/luan-giai-tu-vi-chuyen-sau',
          },
          {
            '@type': 'Offer',
            name: 'Gói Chuyên Gia Đại Tông Sư Expert (Luận Giải Trọn Bộ 12 Cung, 12 Tháng Lưu Nguyệt & Khấu Trừ 269k Xem 1-1)',
            description:
              'Bản luận giải cao cấp nhất (~4.500 - 6.000 từ) phân tích riêng biệt toàn bộ 12 Cung + Cung Thân, đối chiếu Diện Tướng & Chỉ Tay chuyên gia, bối cảnh kiều bào nước ngoài, Phong Thủy Cải Vận, chi tiết 12 tháng Âm lịch, tặng 02 câu hỏi Chuyên Gia và được khấu trừ trọn 269.000đ nếu nâng cấp xem trực tiếp 1-1 (chỉ đóng thêm 1.730.000đ).',
            price: '269000',
            priceCurrency: 'VND',
            url: 'https://www.tuvithayton.vn/luan-giai-tu-vi-chuyen-gia',
          },
          {
            '@type': 'Offer',
            name: 'Khóa Học Tử Vi Đẩu Số Thực Chiến Online (24 Bài Podcast & Giáo Trình Tương Tác)',
            description:
              'Trọn bộ 24 bài giảng Podcast & giáo trình Web tương tác về 14 Chính Tinh, Lục Cát, Lục Sát, Tứ Hóa, 4 Cách Cục lớn và quy trình 5 bước chấm vận hạn cùng Thầy Tôn.',
            price: '699000',
            priceCurrency: 'VND',
            url: 'https://www.tuvithayton.vn/khoa-hoc',
          },
          {
            '@type': 'Offer',
            name: 'Nâng Cấp Xem Trực Tiếp 1-1 Cùng Thầy Tôn (Ưu Đãi Khấu Trừ Gói Expert 269K)',
            description:
              'Đặc quyền dành cho khách hàng đã sở hữu Bản Chuyên Gia Expert (269.000đ): khấu trừ trực tiếp 269.000đ từ giá gốc 2.000.000đ, chỉ cần đóng thêm 1.730.000đ để gặp trực tiếp 1-1 tại Royal City Hà Nội hoặc Online Video Call.',
            price: '1730000',
            priceCurrency: 'VND',
            url: 'https://www.tuvithayton.vn/dat-lich-xem-tu-vi',
          },
          {
            '@type': 'Offer',
            name: 'Tư Vấn Phong Thủy Thực Chứng & Xem Tử Vi Trực Tiếp 1-1 Cùng Thầy Tôn',
            description:
              'Đàm đạo 1-1 trực tiếp tại Royal City (Hà Nội) hoặc tư vấn qua Video Call toàn cầu: Thẩm định giờ sinh qua Diện Tướng & Chỉ Tay, luận sâu lá số cho quyết định lớn và tư vấn Phong Thủy Nhà ở, Chung cư, Văn phòng, Trạch Nhật.',
            price: '2000000',
            priceCurrency: 'VND',
            url: 'https://www.tuvithayton.vn/dat-lich-xem-tu-vi',
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.tuvithayton.vn/#faq',
      mainEntity: HOME_FUNNEL_PAGE.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answerText,
        },
      })),
    },
    {
      '@type': 'VideoObject',
      '@id': 'https://www.tuvithayton.vn/#guide-video',
      name: 'Hướng Dẫn Xem Tử Vi Chuẩn Xác Chỉ 30 Giây Tại Tử Vi Thầy Tôn (tuvithayton.vn)',
      description:
        'Video hướng dẫn 3 bước lập lá số Tử Vi 108 sao miễn phí theo phái Tân Biên, tải ảnh Khuôn mặt & Chỉ tay soi Tướng Pháp, hỏi đáp cùng Thầy Tôn và xuất PDF trọn đời.',
      thumbnailUrl: ['https://www.tuvithayton.vn/video-guide-poster.jpg'],
      uploadDate: '2026-11-25T00:00:00+07:00',
      duration: 'PT55S',
      contentUrl:
        'https://ubkvzgwespfvrlpjuxkp.supabase.co/storage/v1/object/public/tuvi-media/tuvi-guide-16x9.mp4',
      embedUrl: 'https://www.tuvithayton.vn/#huong-dan-video',
      inLanguage: 'vi',
      publisher: {
        '@type': 'Organization',
        name: 'Tử Vi & Phong Thủy Thầy Tôn',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.tuvithayton.vn/thay-ton.png',
        },
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <TuViWorkspaceClient landingMode="default" />
    </>
  );
}
