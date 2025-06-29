"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          alert("You must be logged in");
          router.push("/");
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SELLER}/auth/profile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
        setLoading(false);
        if (response.data.role === "User") {
          alert("You are not authorized to access this page.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        alert("Failed to load profile. Please login again.");
        router.push("/");
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SELLER}/categories`
        );
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params: any = { page: currentPage, limit: 10 };
        if (selectedCategory) params.category = selectedCategory;
        if (searchTerm) params.title = searchTerm;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SELLER}/articles`,
          { params }
        );
        setArticles(res.data.data);
        setCurrentPage(res.data.page);
        setTotalPages(Math.ceil(res.data.total / res.data.limit));
        setTotalArticles(res.data.total);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, [selectedCategory, searchTerm, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCreateArticleClick = () => {
    router.push("/addArtikel");
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        alert("You must be logged in to delete an article.");
        return;
      }
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SELLER}/articles/${articleToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setShowDeleteModal(false);
        setArticleToDelete(null);
        const params: any = { page: currentPage, limit: 10 };
        if (selectedCategory) params.category = selectedCategory;
        if (searchTerm) params.title = searchTerm;

        const refreshRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SELLER}/articles`,
          { params }
        );

        setArticles(refreshRes.data.data);
        setTotalPages(Math.ceil(refreshRes.data.total / refreshRes.data.limit));
        setTotalArticles(refreshRes.data.total);
      } else {
        alert("Failed to delete article.");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article.");
    }
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    router.push("/");
  };
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      if (currentPage > 2) pageNumbers.push("...");

      if (currentPage - 1 > 1) pageNumbers.push(currentPage - 1);
      pageNumbers.push(currentPage);
      if (currentPage + 1 < totalPages) pageNumbers.push(currentPage + 1);

      if (currentPage < totalPages - 1) pageNumbers.push("...");

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="">
      <div className="grid h-screen sm:h-screen md:flex">
        <div
          className={`w-screen bg-[#2563EB] text-white flex flex-col p-4 md:flex sm:flex md:w-[250px] md:px-[30px] ${
            isSidebarOpen ? "block" : "hidden"
          } md:block sm:block`}
          id="sideNav"
        >
          <div className="">
            <a href="/dashboard">
              {" "}
              <svg
                width="134"
                height="24"
                viewBox="0 0 134 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2035_5422)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 8.37209V17.3023H2.80335C3.09785 17.3023 3.38948 17.3601 3.6616 17.4723C3.93365 17.5845 4.18093 17.7489 4.38913 17.9562C4.59739 18.1635 4.76261 18.4097 4.87534 18.6805C4.98799 18.9514 5.04603 19.2417 5.04603 19.5349V22.3256H11.7741L20.1841 13.9535V5.02326H17.3808C17.0862 5.02326 16.7946 4.96552 16.5225 4.85332C16.2504 4.74112 16.0032 4.57667 15.795 4.36936C15.5867 4.16205 15.4215 3.91592 15.3087 3.64506C15.1961 3.3742 15.1381 3.08389 15.1381 2.7907V0H8.41004L0 8.37209ZM9.53138 16.7442H5.60669V10.6047L10.6527 5.5814H14.5774V11.7209L9.53138 16.7442Z"
                    fill="white"
                  />
                  <path
                    d="M129.272 6.83484C130.689 6.83484 131.827 7.27019 132.688 8.14089C133.563 8.9978 134 10.2002 134 11.7481V18.4857H131.084V12.142C131.084 11.2436 130.855 10.5595 130.397 10.0896C129.939 9.60589 129.314 9.36405 128.523 9.36405C127.732 9.36405 127.1 9.60589 126.628 10.0896C126.17 10.5595 125.941 11.2436 125.941 12.142V18.4857H123.025V12.142C123.025 11.2436 122.796 10.5595 122.338 10.0896C121.88 9.60589 121.255 9.36405 120.464 9.36405C119.659 9.36405 119.02 9.60589 118.548 10.0896C118.09 10.5595 117.861 11.2436 117.861 12.142V18.4857H114.945V7.00066H117.861V8.38965C118.236 7.90596 118.714 7.52587 119.298 7.24948C119.895 6.97303 120.547 6.83484 121.255 6.83484C122.158 6.83484 122.963 7.02835 123.671 7.4153C124.379 7.78848 124.927 8.32747 125.316 9.03235C125.691 8.36894 126.232 7.83681 126.94 7.43601C127.662 7.03521 128.44 6.83484 129.272 6.83484Z"
                    fill="white"
                  />
                  <path
                    d="M112.797 7.00073V18.4858H109.861V17.0346C109.486 17.5322 108.993 17.926 108.382 18.2163C107.785 18.4927 107.133 18.6309 106.425 18.6309C105.522 18.6309 104.724 18.4443 104.03 18.0711C103.336 17.6842 102.788 17.1244 102.385 16.3919C101.996 15.6456 101.802 14.7611 101.802 13.7384V7.00073H104.717V13.3237C104.717 14.2359 104.946 14.9408 105.404 15.4383C105.863 15.922 106.487 16.1639 107.278 16.1639C108.084 16.1639 108.715 15.922 109.174 15.4383C109.632 14.9408 109.861 14.2359 109.861 13.3237V7.00073H112.797Z"
                    fill="white"
                  />
                  <path
                    d="M95.7018 18.6723C94.7576 18.6723 93.9104 18.5064 93.1608 18.1747C92.4112 17.8292 91.8141 17.3662 91.3701 16.7858C90.9395 16.2053 90.7034 15.5626 90.6619 14.8578H93.5982C93.6537 15.3 93.869 15.6663 94.244 15.9565C94.6326 16.2468 95.1114 16.3919 95.6805 16.3919C96.2361 16.3919 96.6667 16.2813 96.9717 16.0602C97.2913 15.839 97.4511 15.5557 97.4511 15.2102C97.4511 14.8371 97.2565 14.5606 96.868 14.381C96.4929 14.1875 95.889 13.9802 95.0559 13.759C94.1953 13.5517 93.4871 13.3375 92.9321 13.1164C92.3905 12.8952 91.9184 12.5566 91.5158 12.1006C91.1267 11.6444 90.9327 11.0294 90.9327 10.2555C90.9327 9.61974 91.1133 9.03928 91.4743 8.51407C91.8489 7.98886 92.3765 7.57427 93.0565 7.2702C93.7512 6.96612 94.5631 6.81409 95.4932 6.81409C96.868 6.81409 97.9646 7.15963 98.7838 7.85066C99.6029 8.52791 100.054 9.44694 100.137 10.6079H97.3468C97.3053 10.1518 97.1107 9.79249 96.7637 9.52988C96.4307 9.25349 95.9793 9.11524 95.4102 9.11524C94.8826 9.11524 94.4728 9.21202 94.1812 9.40553C93.9037 9.59898 93.7647 9.86851 93.7647 10.214C93.7647 10.601 93.9592 10.8982 94.3478 11.1055C94.7369 11.299 95.3407 11.4993 96.1599 11.7066C96.9924 11.914 97.6798 12.1282 98.2214 12.3493C98.763 12.5705 99.2278 12.9159 99.6169 13.3858C100.019 13.842 100.228 14.45 100.242 15.2102C100.242 15.8736 100.054 16.4679 99.6792 16.9931C99.3181 17.5183 98.7905 17.9329 98.0964 18.237C97.4163 18.5272 96.6179 18.6723 95.7018 18.6723Z"
                    fill="white"
                  />
                  <path
                    d="M80.8172 8.65918C81.1922 8.13398 81.7058 7.69863 82.3584 7.35314C83.0245 6.99381 83.7814 6.81409 84.628 6.81409C85.6137 6.81409 86.5023 7.05598 87.294 7.53972C88.0991 8.02341 88.7304 8.71444 89.1891 9.61282C89.6612 10.4974 89.8966 11.527 89.8966 12.7017C89.8966 13.8765 89.6612 14.9199 89.1891 15.8321C88.7304 16.7305 88.0991 17.4285 87.294 17.926C86.5023 18.4235 85.6137 18.6723 84.628 18.6723C83.7814 18.6723 83.0318 18.4995 82.3792 18.154C81.7406 17.8085 81.2197 17.3731 80.8172 16.848V23.9587H77.9017V7.00067H80.8172V8.65918ZM86.9189 12.7017C86.9189 12.0107 86.7731 11.4164 86.4816 10.9189C86.2041 10.4075 85.829 10.0205 85.3569 9.75794C84.8988 9.49533 84.3993 9.36406 83.8577 9.36406C83.3301 9.36406 82.8305 9.50225 82.3584 9.77865C81.8998 10.0412 81.5253 10.4282 81.2337 10.9396C80.9562 11.4509 80.8172 12.0522 80.8172 12.7432C80.8172 13.4342 80.9562 14.0355 81.2337 14.5468C81.5253 15.0582 81.8998 15.4521 82.3584 15.7285C82.8305 15.9911 83.3301 16.1224 83.8577 16.1224C84.3993 16.1224 84.8988 15.9842 85.3569 15.7078C85.829 15.4313 86.2041 15.0374 86.4816 14.5261C86.7731 14.0147 86.9189 13.4066 86.9189 12.7017Z"
                    fill="white"
                  />
                  <path
                    d="M74.3128 5.63245C73.7992 5.63245 73.3692 5.4735 73.0221 5.15563C72.6886 4.82393 72.522 4.41622 72.522 3.93249C72.522 3.44877 72.6886 3.04797 73.0221 2.73009C73.3692 2.3984 73.7992 2.23254 74.3128 2.23254C74.8269 2.23254 75.2503 2.3984 75.5833 2.73009C75.9303 3.04797 76.1042 3.44877 76.1042 3.93249C76.1042 4.41622 75.9303 4.82393 75.5833 5.15563C75.2503 5.4735 74.8269 5.63245 74.3128 5.63245ZM75.7498 7.00067V18.4857H72.8343V7.00067H75.7498Z"
                    fill="white"
                  />
                  <path
                    d="M65.406 18.6723C64.2953 18.6723 63.2962 18.4304 62.4076 17.9467C61.5189 17.4492 60.8181 16.7512 60.3039 15.8529C59.8044 14.9546 59.5543 13.918 59.5543 12.7432C59.5543 11.5684 59.8111 10.5319 60.3247 9.63353C60.8523 8.7352 61.5677 8.04417 62.4698 7.56043C63.3725 7.06291 64.3789 6.81409 65.4896 6.81409C66.6003 6.81409 67.6067 7.06291 68.5093 7.56043C69.4115 8.04417 70.1196 8.7352 70.6332 9.63353C71.1607 10.5319 71.4248 11.5684 71.4248 12.7432C71.4248 13.918 71.154 14.9546 70.6124 15.8529C70.0848 16.7512 69.3632 17.4492 68.4465 17.9467C67.5444 18.4304 66.5307 18.6723 65.406 18.6723ZM65.406 16.1431C65.9336 16.1431 66.4264 16.0187 66.8851 15.7699C67.3572 15.5073 67.7317 15.1204 68.0092 14.609C68.2873 14.0976 68.4258 13.4757 68.4258 12.7432C68.4258 11.6514 68.1342 10.8152 67.5511 10.2348C66.9821 9.64045 66.2807 9.3433 65.4481 9.3433C64.6149 9.3433 63.9141 9.64045 63.3444 10.2348C62.7894 10.8152 62.5119 11.6514 62.5119 12.7432C62.5119 13.835 62.7821 14.6781 63.3237 15.2724C63.8793 15.8529 64.5734 16.1431 65.406 16.1431Z"
                    fill="white"
                  />
                  <path
                    d="M52.8551 18.6723C51.7444 18.6723 50.7449 18.4304 49.8563 17.9467C48.9678 17.4492 48.2667 16.7512 47.753 15.8529C47.2532 14.9546 47.0033 13.918 47.0033 12.7432C47.0033 11.5684 47.2601 10.5319 47.7738 9.63353C48.3014 8.7352 49.0164 8.04417 49.9188 7.56043C50.8212 7.06291 51.8277 6.81409 52.9384 6.81409C54.0491 6.81409 55.0556 7.06291 55.9581 7.56043C56.8603 8.04417 57.5684 8.7352 58.082 9.63353C58.6096 10.5319 58.8737 11.5684 58.8737 12.7432C58.8737 13.918 58.6029 14.9546 58.0613 15.8529C57.5337 16.7512 56.8121 17.4492 55.8956 17.9467C54.9932 18.4304 53.9797 18.6723 52.8551 18.6723ZM52.8551 16.1431C53.3827 16.1431 53.8755 16.0187 54.3337 15.7699C54.8057 15.5073 55.1806 15.1204 55.4582 14.609C55.7359 14.0976 55.8748 13.4757 55.8748 12.7432C55.8748 11.6514 55.5832 10.8152 55.0001 10.2348C54.4309 9.64045 53.7298 9.3433 52.8968 9.3433C52.0638 9.3433 51.3627 9.64045 50.7934 10.2348C50.2381 10.8152 49.9604 11.6514 49.9604 12.7432C49.9604 13.835 50.2312 14.6781 50.7726 15.2724C51.328 15.8529 52.0221 16.1431 52.8551 16.1431Z"
                    fill="white"
                  />
                  <path
                    d="M40.304 18.6723C39.1933 18.6723 38.1937 18.4304 37.3052 17.9467C36.4166 17.4492 35.7155 16.7512 35.2018 15.8529C34.702 14.9546 34.4521 13.918 34.4521 12.7432C34.4521 11.5684 34.709 10.5319 35.2227 9.63353C35.7502 8.7352 36.4652 8.04417 37.3676 7.56043C38.27 7.06291 39.2766 6.81409 40.3873 6.81409C41.4979 6.81409 42.5045 7.06291 43.4069 7.56043C44.3093 8.04417 45.0173 8.7352 45.531 9.63353C46.0586 10.5319 46.3224 11.5684 46.3224 12.7432C46.3224 13.918 46.0517 14.9546 45.5102 15.8529C44.9826 16.7512 44.2607 17.4492 43.3444 17.9467C42.442 18.4304 41.4285 18.6723 40.304 18.6723ZM40.304 16.1431C40.8316 16.1431 41.3244 16.0187 41.7826 15.7699C42.2546 15.5073 42.6295 15.1204 42.9071 14.609C43.1847 14.0976 43.3236 13.4757 43.3236 12.7432C43.3236 11.6514 43.0321 10.8152 42.4489 10.2348C41.8797 9.64045 41.1786 9.3433 40.3456 9.3433C39.5126 9.3433 38.8115 9.64045 38.2423 10.2348C37.6869 10.8152 37.4093 11.6514 37.4093 12.7432C37.4093 13.835 37.68 14.6781 38.2215 15.2724C38.7768 15.8529 39.471 16.1431 40.304 16.1431Z"
                    fill="white"
                  />
                  <path
                    d="M29.2669 16.1846H34.0567V18.4857H26.3514V4.01538H29.2669V16.1846Z"
                    fill="white"
                  />
                  <path
                    d="M47.7725 20.0284C48.511 22.2147 50.5867 23.7896 53.0319 23.7896H53.3362C56.4 23.7896 58.8838 21.3171 58.8838 18.2671V17.9551H55.8761V18.2671C55.8761 19.6636 54.739 20.7956 53.3362 20.7956H53.0319C52.317 20.7956 51.671 20.5016 51.2095 20.0284H47.7725Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2035_5422">
                    <rect width="134" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
          <div className="pt-[20px]">
            <nav className="grid gap-[20px] text-[14px]">
              <div>
                <div className="flex items-center flex items-center gap-2 p-2 block text-white rounded transition duration-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-400 hover:text-white">
                  <div className="">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2077_876)">
                        <path
                          d="M12.5 15H8.33331"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 11.6665H8.33331"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33335 18.3332H16.6667C17.1087 18.3332 17.5326 18.1576 17.8452 17.845C18.1578 17.5325 18.3334 17.1085 18.3334 16.6665V3.33317C18.3334 2.89114 18.1578 2.46722 17.8452 2.15466C17.5326 1.8421 17.1087 1.6665 16.6667 1.6665H6.66669C6.22466 1.6665 5.80074 1.8421 5.48818 2.15466C5.17561 2.46722 5.00002 2.89114 5.00002 3.33317V16.6665C5.00002 17.1085 4.82443 17.5325 4.51186 17.845C4.1993 18.1576 3.77538 18.3332 3.33335 18.3332ZM3.33335 18.3332C2.89133 18.3332 2.4674 18.1576 2.15484 17.845C1.84228 17.5325 1.66669 17.1085 1.66669 16.6665V9.1665C1.66669 8.72448 1.84228 8.30055 2.15484 7.98799C2.4674 7.67543 2.89133 7.49984 3.33335 7.49984H5.00002"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.1666 5H9.16665C8.70641 5 8.33331 5.3731 8.33331 5.83333V7.5C8.33331 7.96024 8.70641 8.33333 9.16665 8.33333H14.1666C14.6269 8.33333 15 7.96024 15 7.5V5.83333C15 5.3731 14.6269 5 14.1666 5Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2077_876">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <a className="" href="/dashboard">
                    Articles
                  </a>
                </div>
              </div>
              <div className="flex items-center flex items-center gap-2 p-2 block text-white rounded transition duration-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-400 hover:text-white">
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2077_886)">
                      <path
                        d="M10.4884 2.15484C10.1759 1.84225 9.75201 1.6666 9.31002 1.6665H3.33335C2.89133 1.6665 2.4674 1.8421 2.15484 2.15466C1.84228 2.46722 1.66669 2.89114 1.66669 3.33317V9.30984C1.66678 9.75183 1.84244 10.1757 2.15502 10.4882L9.40835 17.7415C9.78712 18.1179 10.2994 18.3291 10.8334 18.3291C11.3673 18.3291 11.8796 18.1179 12.2584 17.7415L17.7417 12.2582C18.1181 11.8794 18.3293 11.3671 18.3293 10.8332C18.3293 10.2992 18.1181 9.78693 17.7417 9.40817L10.4884 2.15484Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.24998 6.66683C6.4801 6.66683 6.66665 6.48028 6.66665 6.25016C6.66665 6.02004 6.4801 5.8335 6.24998 5.8335C6.01986 5.8335 5.83331 6.02004 5.83331 6.25016C5.83331 6.48028 6.01986 6.66683 6.24998 6.66683Z"
                        fill="white"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2077_886">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <a className="" href="/category">
                  Category
                </a>
              </div>

              <div className="flex items-center gap-2 p-2 block text-white rounded transition duration-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-400 hover:text-white">
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.3333 14.1668L17.5 10.0002L13.3333 5.8335"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5 10H7.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <a className="" onClick={handleLogout}>
                  Logout
                </a>
              </div>
            </nav>
          </div>
        </div>

        <div className="w-screen flex-1 flex flex-col bg-gray-100">
          <div className="bg-white shadow-md flex justify-between p-4 items-center">
            <div className="flex items-center gap-[15px]">
              <div className="md:hidden flex items-center">
                <button
                  id="menuBtn"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <span className="text-gray-500 text-lg">&#9776;</span>
                </button>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-xl">Articles</span>
              </div>
            </div>
            <div className="space-x-5 flex items-center">
              <a href="/profile">
                <div className="">
                  <div
                    className="w-10 h-10 flex items-center justify-center text-xl font-bold text-white rounded-full"
                    style={{
                      backgroundColor: "#BFDBFE",
                      color: "#1E3A8A",
                    }}
                  >
                    {profile?.username
                      ? profile.username.charAt(0).toUpperCase()
                      : "N/A"}
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="pt-[10px] px-4 pb-2 overflow:hidden">
            <div className="bg-white text-sm text-gray-700 p-4 rounded-lg">
              Total Articles: {totalArticles}
            </div>
          </div>

          <div className="flex px-4">
            <div className="relative max-w-md w-full flex justify-between">
              <div className="grid gap-[10px] md:flex">
                <div className="bg-white rounded-lg">
                  <select
                    className="w-full outline-none text-gray-700 p-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-white rounded-lg">
                  <input
                    type="text"
                    placeholder="Search by title"
                    className="w-full outline-none text-gray-700 p-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="">
                <button
                  onClick={handleCreateArticleClick}
                  className="bg-[#2563EB] lg:w-[150px] text-white px-4 py-2 rounded"
                >
                  +Article
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-sm leading-normal">
                  <th className="py-2 px-4 bg-gray-100 font-bold text-gray-600 border-b">
                    Thumbnails
                  </th>
                  <th className="py-2 px-4 bg-gray-100 font-bold text-gray-600 border-b">
                    Title
                  </th>
                  <th className="py-2 px-4 bg-gray-100 font-bold text-gray-600 border-b">
                    Category
                  </th>
                  <th className="py-2 px-4 bg-gray-100 font-bold text-gray-600 border-b">
                    Created At
                  </th>
                  <th className="py-2 px-4 bg-gray-100 font-bold text-gray-600 border-b">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white rounded-lg text-center">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-200">
                    <td className="py-2 px-4 border-b border-gray-100 border-y-3">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded" />
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-100 border-y-3">
                      {article.title}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-100 border-y-3">
                      {article.category.name}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-100 border-y-3">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-100 border-y-3">
                      <div className="flex">
                        <Link href={`/preview/${article.id}`} key={article.id}>
                          <button className="text-blue-600 hover:text-blue-800 mr-2">
                            Preview
                          </button>
                        </Link>
                        <button
                          className="text-yellow-600 hover:text-yellow-800 mr-2"
                          onClick={() => handleEdit(article.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => {
                            setArticleToDelete(article.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center space-x-4 p-4 items-center bg-white">
            <div className="flex items-center">
              <div>
                <svg
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 1L1.5 5L5.5 9"
                    stroke="#0F172A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 ? "cursor-not-allowed" : ""
                  }`}
                >
                  Previous
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="text-sm text-gray-700">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 py-1 rounded ${
                      page === currentPage
                        ? "bg-white border border-gray-200"
                        : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <div className="flex items-center">
              <div>
                {" "}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages ? "cursor-not-allowed" : ""
                  }`}
                >
                  Next
                </button>
              </div>
              <div>
                <svg
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 9L5.5 5L1.5 1"
                    stroke="#0F172A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/4">
              <h2 className="text-xl font-bold mb-4">Delete Article</h2>
              <p className="text-sm mb-4">
                Deleting this article is permanent and cannot be undone. All
                related content will be removed.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
