import React, { useState, ChangeEvent } from "react";
import { Box, Container, Typography } from "@mui/material";
import { Search as SearchIcon, LocationOn } from "@mui/icons-material";
import Input from "../common/Input";
import Button from "../common/Button";
import { styled } from "@mui/material/styles";

const HeroSection = styled(Box)({
  background: "linear-gradient(135deg, #0f4c3a 0%, #1a7a5e 100%)",
  color: "white",
  padding: "60px 0 50px 0",
  textAlign: "center" as const,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>\')',
    opacity: 0.3,
  },
});

const SearchContainer = styled(Box)({
  display: "flex",
  gap: "12px",
  maxWidth: "800px",
  margin: "0 auto",
  padding: "0 20px",
  position: "relative",
  zIndex: 2,
  "@media (max-width: 768px)": {
    flexDirection: "column",
    gap: "16px",
  },
});

const StyledInput = styled(Box)({
  "& .MuiInputBase-root": {
    backgroundColor: "white",
    borderRadius: "8px",
    height: "50px",
    fontSize: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "none",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 16px 14px 50px",
  },
});

interface JobSearchHeroProps {
  onSearch: (query: string, location: string) => void;
}

export const JobSearchHero: React.FC<JobSearchHeroProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery, location);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <HeroSection>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            opacity: 0.95,
            fontWeight: 400,
            fontSize: "1.1rem",
          }}
        >
          Tiếp cận <strong>40,000+</strong> tin tuyển dụng việc làm mỗi ngày từ
          hàng nghìn doanh nghiệp uy tín tại Việt Nam
        </Typography>

        <SearchContainer>
          <StyledInput sx={{ flex: 2, color: "black" }}>
            <Input
              fullWidth
              placeholder="Danh mục Nghề, remote job..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              onKeyPress={handleKeyPress}
              icon={<SearchIcon sx={{ color: "#666" }} />}
            />
          </StyledInput>

          <StyledInput sx={{ flex: 1, color: "black" }}>
            <Input
              fullWidth
              placeholder="Địa điểm"
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
              onKeyPress={handleKeyPress}
              icon={<LocationOn sx={{ color: "#666" }} />}
            />
          </StyledInput>

          <Button
            variant="primary"
            onClick={handleSearch}
            // sx={{
            //   backgroundColor: "#22c55e",
            //   color: "white",
            //   fontWeight: 600,
            //   height: "50px",
            //   minWidth: "120px",
            //   borderRadius: "8px",
            //   fontSize: "16px",
            //   boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)",
            //   "&:hover": {
            //     backgroundColor: "#16a34a",
            //     boxShadow: "0 4px 16px rgba(34, 197, 94, 0.4)",
            //     transform: "translateY(-1px)",
            //   },
            //   transition: "all 0.2s ease",
            // }}
          >
            Tìm kiếm
          </Button>
        </SearchContainer>

        {/* Popular Categories */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {[
            "Kinh doanh/Bán hàng",
            "Marketing/PR",
            "IT/Phần mềm",
            "Nhân sự",
            "Kế toán",
          ].map((category) => (
            <Box
              key={category}
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {category}
            </Box>
          ))}
        </Box>
      </Container>
    </HeroSection>
  );
};
