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
      priceRange: '0 VNĐ - 699.000 VNĐ',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Khu đô thị Royal City, 72A Nguyễn Trãi, Thanh Xuân',
        addressLocality: 'Hà Nội',
        addressCountry: 'VN',
      },
      founder: { '@id': 'https://www.tuvithayton.vn/#thayton' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Các Gói Dịch Vụ An Sao, Luận Giải Tử Vi & Tư Vấn Phong Thủy Thầy Tôn',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Gói Khởi Nguyên — An Sao & Bình Giải Tử Vi Miễn Phí',
            description:
              'Lập lá số Tử Vi 108 sao chính xác theo giờ sinh và nhận bài bình giải Khởi Nguyên miễn phí (~1.000 từ) về Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận & Tiểu Vận.',
            price: '0',
            priceCurrency: 'VND',
          },
          {
            '@type': 'Offer',
            name: 'Gói Chuyên Sâu VIP Pro (Kèm Xem Ảnh Mặt, Chỉ Tay & 02 Câu Hỏi VIP)',
            description:
              'Luận giải chuyên sâu (~2.500 từ) mổ xẻ Tứ Trụ Mệnh - Thân - Tài - Quan - Phu Thê, kết hợp soi Diện Tướng khuôn mặt, Thủ Tướng bàn tay, Đại Vận 10 năm, Vận khí 4 mùa và tặng kèm 02 câu hỏi VIP.',
            price: '119000',
            priceCurrency: 'VND',
          },
          {
            '@type': 'Offer',
            name: 'Gói Chuyên Gia Đại Tông Sư Expert (Luận Giải Trọn Bộ 12 Cung, 12 Tháng Lưu Nguyệt & Phong Thủy Cải Vận)',
            description:
              'Bản luận giải cao cấp nhất (~4.500 - 6.000 từ) phân tích riêng biệt toàn bộ 12 Cung + Cung Thân, đối chiếu Diện Tướng & Chỉ Tay chuyên gia, Phong Thủy Cải Vận theo Dụng thần, Đại Vận 10 năm, chi tiết 12 tháng Âm lịch và tặng 02 câu hỏi Chuyên Gia.',
            price: '269000',
            priceCurrency: 'VND',
          },
          {
            '@type': 'Offer',
            name: 'Tư Vấn Phong Thủy Thực Chứng & Xem Tử Vi Trực Tiếp 1-1 Cùng Thầy Tôn',
            description:
              'Đàm đạo 1-1 trực tiếp tại Royal City (Hà Nội), khảo sát Phong Thủy thực địa hoặc tư vấn qua Video Call: Khảo sát & bố cục Phong Thủy Nhà ở, Biệt thự, Chung cư, Văn phòng, Cửa hàng; Xem ngày giờ tốt Động thổ, Nhập trạch, Khai trương kết hợp Lá số Tử Vi gia chủ.',
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
