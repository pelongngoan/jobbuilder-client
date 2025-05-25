# Hệ thống Đa ngôn ngữ (i18n) - JobBuilder

## Tổng quan

Ứng dụng JobBuilder sử dụng `react-i18next` để hỗ trợ đa ngôn ngữ. Hiện tại hỗ trợ:

- 🇺🇸 Tiếng Anh (English) - `en`
- 🇻🇳 Tiếng Việt - `vi`

## Cấu trúc thư mục

```
src-v2/i18n/
├── config.ts          # Cấu hình i18n
├── locales/
│   ├── en.json        # Bản dịch tiếng Anh
│   └── vi.json        # Bản dịch tiếng Việt
└── README.md          # Hướng dẫn này
```

## Các trang đã được cập nhật

### ✅ **Đã hoàn thành:**

1. **NavBar** - Navigation bar với menu và user dropdown
2. **HomePage** - Trang chủ với danh sách việc làm
3. **JobCard** - Component hiển thị thông tin việc làm
4. **SaveJobsPage** - Trang việc làm đã lưu
5. **JobSearchPage** - Trang tìm kiếm việc làm (một phần)
6. **JobDetails** - Trang chi tiết việc làm
7. **ProfilePage** - Trang hồ sơ người dùng
8. **ApplicationListPage** - Trang danh sách ứng tuyển
9. **CompanyDetail** - Trang chi tiết công ty
10. **ApplicationApply** - Modal ứng tuyển công việc
11. **JobListPage** - Trang danh sách việc làm

### 🔄 **Cần cập nhật thêm:**

- ResumeBuilder.tsx
- CompanyList.tsx
- ResumeListPage.tsx
- ResumeCard.tsx
- JobByCategory.tsx
- LanguageDemo.tsx

## Cách sử dụng

### 1. Sử dụng hook useTranslation

```tsx
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("common.welcome")}</h1>
      <button>{t("common.login")}</button>
    </div>
  );
};
```

### 2. Sử dụng component LanguageSwitcher

```tsx
import { LanguageSwitcher } from '../components/common';

// Dạng button
<LanguageSwitcher variant="button" />

// Dạng dropdown
<LanguageSwitcher variant="dropdown" />
```

### 3. Thêm bản dịch mới

#### Bước 1: Thêm vào file en.json

```json
{
  "newSection": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

#### Bước 2: Thêm vào file vi.json

```json
{
  "newSection": {
    "title": "Tiêu đề mới",
    "description": "Mô tả mới"
  }
}
```

#### Bước 3: Sử dụng trong component

```tsx
const { t } = useTranslation();
return <h1>{t("newSection.title")}</h1>;
```

## Cấu trúc bản dịch hiện tại

### common

- `welcome`: Lời chào mừng
- `login`: Đăng nhập
- `register`: Đăng ký
- `logout`: Đăng xuất
- `search`: Tìm kiếm
- `submit`: Xác nhận
- `cancel`: Hủy bỏ
- `language`: Ngôn ngữ
- `changeLanguage`: Đổi ngôn ngữ
- `viewAll`: Xem tất cả
- `viewDetails`: Xem chi tiết
- `save`: Lưu
- `unsave`: Bỏ lưu
- `loading`: Đang tải...
- `noData`: Không có dữ liệu
- `error`: Đã xảy ra lỗi

### navigation

- `jobs`: Việc làm / Jobs
- `companies`: Công ty / Companies
- `tools`: Công cụ / Tools
- `jobsByCategory`: VIỆC LÀM THEO DANH MỤC / JOBS BY CATEGORY
- `careerTools`: CÔNG CỤ NGHỀ NGHIỆP / CAREER TOOLS
- `resumeBuilder`: Tạo CV / Resume Builder
- `myAccount`: Tài khoản của tôi / My Account

### homepage

- `bestJobs`: Việc làm tốt nhất / Best Jobs
- `poweredByAI`: Được xuất bởi TOPPY AI / Powered by TOPPY AI
- `filterBy`: Lọc theo / Filter by
- `location`: Địa điểm / Location
- `suggestion`: Gợi ý / Suggestion
- `hoverTooltip`: Di chuột vào tiêu đề việc làm để xem thêm thông tin chi tiết
- `noJobsTitle`: Chưa có việc làm nào / No jobs available
- `noJobsDescription`: Hãy quay lại sau để xem các cơ hội việc làm mới

### jobCard

- `negotiable`: Thỏa thuận / Negotiable
- `from`: Từ / From
- `upTo`: Lên đến / Up to
- `expired`: Đã hết hạn / Expired
- `expiresIn`: Còn / Expires in
- `expiresInDays`: ngày / days
- `expiresToday`: Hết hạn hôm nay / Expires today
- `expiresTomorrow`: Hết hạn ngày mai / Expires tomorrow
- `applicants`: ứng viên / applicants
- `companyUnknown`: Công ty chưa xác định / Company unknown
- `locationUnknown`: Chưa xác định / Location unknown
- `typeUnknown`: Không xác định / Type unknown
- `saveJob`: Lưu việc làm / Save job
- `unsaveJob`: Bỏ lưu / Unsave job

### jobTypes

- `full-time`: Toàn thời gian / Full-time
- `part-time`: Bán thời gian / Part-time
- `contract`: Hợp đồng / Contract
- `internship`: Thực tập / Internship
- `remote`: Làm từ xa / Remote

### jobSearch

- `searchPlaceholder`: remote job
- `locationPlaceholder`: Địa điểm / Location
- `searchButton`: Tìm kiếm / Search
- `allCategories`: Tất cả danh mục / All Categories
- `allExperience`: Tất cả / All Experience
- `under1Year`: Dưới 1 năm / Under 1 year
- `years`: năm / years
- `over5Years`: Trên 5 năm / Over 5 years
- `suggestedKeywords`: Từ khóa gợi ý / Suggested keywords
- `homepage`: Trang chủ / Homepage
- `jobs`: Việc làm / Jobs

### auth

- `email`: Email
- `password`: Mật khẩu / Password
- `forgotPassword`: Quên mật khẩu / Forgot Password
- `confirmPassword`: Xác nhận mật khẩu / Confirm Password
- `alreadyHaveAccount`: Đã có tài khoản / Already have an account
- `dontHaveAccount`: Chưa có tài khoản / Don't have an account

### dashboard

- `overview`: Tổng quan / Overview
- `applications`: Đơn ứng tuyển / Applications
- `savedJobs`: Công việc đã lưu / Saved Jobs
- `profile`: Hồ sơ / Profile

### jobs

- `search`: Tìm kiếm công việc / Search Jobs
- `filter`: Lọc / Filter
- `location`: Địa điểm / Location
- `category`: Danh mục / Category
- `salary`: Lương / Salary
- `applyNow`: Ứng tuyển ngay / Apply Now
- `saveJob`: Lưu công việc / Save Job

## Tính năng

### Lưu ngôn ngữ

- Ngôn ngữ được lưu tự động vào `localStorage`
- Khi tải lại trang, ngôn ngữ sẽ được khôi phục

### Phát hiện ngôn ngữ

- Ưu tiên: localStorage → trình duyệt → HTML tag
- Ngôn ngữ mặc định: Tiếng Anh (en)

## Demo

Để xem demo LanguageSwitcher, truy cập trang `/language-demo` (nếu đã được thêm vào routes).

## Thêm ngôn ngữ mới

### Bước 1: Tạo file bản dịch

Tạo file `src-v2/i18n/locales/[language-code].json`

### Bước 2: Cập nhật config.ts

```tsx
import newLanguageTranslation from "./locales/[language-code].json";

const resources = {
  en: { translation: enTranslation },
  vi: { translation: viTranslation },
  [languageCode]: { translation: newLanguageTranslation }, // Thêm dòng này
};
```

### Bước 3: Cập nhật LanguageSwitcher

```tsx
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "[language-code]", name: "[Language Name]", flag: "[Flag]" }, // Thêm dòng này
];
```

## Lưu ý

1. **Namespace**: Sử dụng cấu trúc phân cấp rõ ràng (common, auth, dashboard, jobs...)
2. **Naming**: Sử dụng camelCase cho keys
3. **Consistency**: Đảm bảo tất cả ngôn ngữ có cùng structure
4. **Fallback**: Luôn có bản dịch tiếng Anh làm fallback

## Tiến độ cập nhật

### ✅ Hoàn thành (8/17 trang)

- [x] NavBar.tsx
- [x] HomePage.tsx
- [x] JobCard.tsx
- [x] SaveJobsPage.tsx
- [x] JobSearchPage.tsx (một phần)
- [x] JobDetails.tsx
- [x] ProfilePage.tsx
- [x] ApplicationListPage.tsx

### 🔄 Đang thực hiện

- [ ] ResumeBuilder.tsx
- [ ] CompanyList.tsx
- [ ] ResumeListPage.tsx
- [ ] ResumeCard.tsx
- [ ] JobByCategory.tsx
- [ ] LanguageDemo.tsx
