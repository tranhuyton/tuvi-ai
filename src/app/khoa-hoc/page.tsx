import React from 'react';
import type { Metadata } from 'next';
import CoursePlayerClient from '@/components/CoursePlayerClient';
import { COURSE_INFO, COURSE_MODULES, COURSE_LESSONS } from '@/lib/courseData';

export const metadata: Metadata = {
  title: {
    absolute: 'Khóa Học Tử Vi Đẩu Số Thực Chiến Online (Podcast & Giáo Trình) | Thầy Tôn',
  },
  description:
    'Khóa học Tử Vi Đẩu Số Thực Chiến cùng Thầy Tôn (699.000đ): Mở khóa ngay 24 bài giảng Podcast & giáo trình tương tác về 14 Chính Tinh, Phụ Tinh, Tứ Hóa, 4 Cách Cục lớn và quy trình 5 bước chấm hạn năm.',
  alternates: {
    canonical: 'https://www.tuvithayton.vn/khoa-hoc',
  },
  openGraph: {
    title: 'Khóa Học Tử Vi Đẩu Số Thực Chiến Cùng Thầy Tôn (Podcast & Giáo Trình)',
    description:
      'Làm chủ 14 Chính Tinh, Lục Cát, Lục Sát, Tứ Hóa, 4 Cách Cục lớn và quy trình xem vận hạn qua 24 bài Podcast & giáo trình tương tác trên Web. Quét mã VietQR 699.000đ mở khóa tự động 24/7.',
    url: 'https://www.tuvithayton.vn/khoa-hoc',
    type: 'website',
    images: [
      {
        url: '/thay-ton.png',
        width: 800,
        height: 800,
        alt: 'Khóa Học Tử Vi Đẩu Số Thực Chiến Cùng Thầy Tôn',
      },
    ],
  },
};

export default function KhoaHocTuViPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: COURSE_INFO.title,
    description: COURSE_INFO.subtitle,
    url: 'https://www.tuvithayton.vn/khoa-hoc',
    provider: {
      '@type': 'Organization',
      name: 'Tử Vi & Phong Thủy Thầy Tôn',
      url: 'https://www.tuvithayton.vn',
    },
    instructor: {
      '@type': 'Person',
      name: 'Thầy Tôn (Trần Huy Tôn)',
      jobTitle: 'Chuyên gia Tử Vi Đẩu Số và Phong Thủy',
      url: 'https://www.tuvithayton.vn/thay-ton',
    },
    offers: {
      '@type': 'Offer',
      price: '699000',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: 'https://www.tuvithayton.vn/khoa-hoc',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT8H',
    },
    syllabusSections: COURSE_MODULES.map((m) => ({
      '@type': 'Syllabus',
      name: m.title,
      description: m.description,
    })),
    numberOfCredits: COURSE_LESSONS.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CoursePlayerClient />
    </>
  );
}
