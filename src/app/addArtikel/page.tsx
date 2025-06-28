"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddArticle: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const router = useRouter();
  const handleChangeWord = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    const words = text.split(/\s+/).filter((word: string) => word.length > 0);
    setWordCount(words.length);
  };
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

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files ? e.target.files[0] : null;
  //   if (file) {
  //     setImageUrl(file);

  //     // Create a URL for the uploaded image and set it as the preview
  //     const fileReader = new FileReader();
  //     fileReader.onloadend = () => {
  //       setImagePreview(fileReader.result as string);
  //     };
  //     fileReader.readAsDataURL(file); // This will trigger onloadend to display the image
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !selectedCategory) {
      alert("Please fill in all fields.");
      return;
    }

    const articleData = {
      title,
      content,
      categoryId: selectedCategory,
    };

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        alert("You must be logged in to upload an article.");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_SELLER}/articles`,
        articleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // withCredentials: true,
        }
      );
      router.push("/dashboard");
    } catch (error) {
      console.error("Error uploading article:", error);
      alert("Failed to create article.");
    }
  };
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    router.push("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Menambahkan tipe untuk parameter e
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
        setImageUrl(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setImagePreview(null);
    setImageUrl(null);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!title || !content || !selectedCategory || !imageUrl) {
  //     alert("Please fill in all fields and upload an image.");
  //     return;
  //   }

  //   const articleData = new FormData();
  //   articleData.append("title", title);
  //   articleData.append("content", content);
  //   articleData.append("categoryId", selectedCategory);
  //   articleData.append("image", imageUrl);

  //   try {
  //     const token = document.cookie
  //       .split("; ")
  //       .find((row) => row.startsWith("token="))
  //       ?.split("=")[1];

  //     if (!token) {
  //       alert("You must be logged in to upload an article.");
  //       return;
  //     }

  //     await axios.post(
  //       `${process.env.NEXT_PUBLIC_SELLER}/articles`,
  //       articleData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     router.push("/dashboard");
  //   } catch (error) {
  //     console.error("Error uploading article:", error);
  //     alert("Failed to create article.");
  //   }
  // };
  const handleChange = () => {
    const inputElement = document.getElementById(
      "dropzone-file"
    ) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  return (
    <div>
      <div className="grid h-screen sm:h-screen md:flex">
        <div
          className={`w-screen bg-[#2563EB] text-white flex flex-col p-4 md:flex sm:flex md:w-[250px] md:px-[30px] ${
            isSidebarOpen ? "block" : "hidden"
          } md:block sm:block`}
          id="sideNav"
        >
          <div className="">
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
          </div>
          <div className="pt-[20px]">
            <nav className="grid gap-[20px] text-[14px]">
              <a
                className="block text-white rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
                href="/dashboard"
              >
                Articles
              </a>
              <a
                className="block text-white rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
                href="/category"
              >
                Category
              </a>
              <a
                className="block text-white rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </a>
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
                <span className="font-bold text-xl">Create Articles</span>
              </div>
            </div>
            <div className="space-x-5 flex items-center">
              <a href="/profile">
                {" "}
                <button>
                  <span className="text-gray-500 text-lg">👤</span>
                </button>
              </a>
            </div>
          </div>
          <div className="p-[12px]">
            <div className="bg-white rounded-lg">
              {" "}
              <div className="pt-[10px] pb-2 overflow:hidden">
                <div className="bg-white text-sm text-gray-700 rounded-lg flex px-4 gap-2">
                  <div className="flex items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 15.8333L4.16669 9.99996L10 4.16663"
                        stroke="#0F172A"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.8334 10H4.16669"
                        stroke="#0F172A"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="bg-white text-sm text-gray-700 py-2 rounded-lg">
                    Create Articles
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="relative max-w-md gap-[8px]">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700">Thumbnails</label>
                      <div className="items-center justify-center">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-[223px] h-[163px] px-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative"
                        >
                          {/* Gambar Preview */}
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Image Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                              </p>
                            </div>
                          )}
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>

                        {/* Delete and Change Buttons Below the Image */}
                        {imagePreview && (
                          <div className="flex justify-center space-x-4">
                            <div
                              onClick={handleDelete}
                              className="text-red-500"
                            >
                              Delete
                            </div>
                            <div
                              onClick={handleChange}
                              className="text-blue-500"
                            >
                              Change
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid">
                      <label className="text-gray-700">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 border rounded border-gray-300"
                        placeholder="Enter article title"
                      />
                    </div>
                    <div className="grid">
                      <label className="block text-gray-700">Category</label>
                      <select
                        className="p-2 border rounded border-gray-300"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Select category</option>
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No categories available</option>
                        )}
                      </select>
                    </div>
                    <div className="grid">
                      <label className="block text-gray-700">Content</label>
                      <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                            <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                              <div className="flex gap-[4px]">
                                <div className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6.00002 9.33341L2.66669 6.00008L6.00002 2.66675"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M2.66669 6H9.66669C10.1482 6 10.625 6.09484 11.0699 6.27911C11.5147 6.46338 11.9189 6.73346 12.2594 7.07394C12.5999 7.41442 12.87 7.81863 13.0542 8.26349C13.2385 8.70835 13.3334 9.18515 13.3334 9.66667C13.3334 10.1482 13.2385 10.625 13.0542 11.0698C12.87 11.5147 12.5999 11.9189 12.2594 12.2594C11.9189 12.5999 11.5147 12.87 11.0699 13.0542C10.625 13.2385 10.1482 13.3333 9.66669 13.3333H7.33335"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                                <div className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10 9.33341L13.3333 6.00008L10 2.66675"
                                      stroke="#CBD5E1"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M13.3334 6H6.33335C5.36089 6 4.42826 6.38631 3.74063 7.07394C3.053 7.76157 2.66669 8.69421 2.66669 9.66667C2.66669 10.1482 2.76153 10.625 2.9458 11.0698C3.13006 11.5147 3.40015 11.9189 3.74063 12.2594C4.42826 12.947 5.36089 13.3333 6.33335 13.3333H8.66669"
                                      stroke="#CBD5E1"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex gap-[4px]">
                                <div className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4 8.00008H10C10.7072 8.00008 11.3855 8.28103 11.8856 8.78113C12.3857 9.28123 12.6667 9.9595 12.6667 10.6667C12.6667 11.374 12.3857 12.0523 11.8856 12.5524C11.3855 13.0525 10.7072 13.3334 10 13.3334H4.66667C4.48986 13.3334 4.32029 13.2632 4.19526 13.1382C4.07024 13.0131 4 12.8436 4 12.6667V3.33341C4 3.1566 4.07024 2.98703 4.19526 2.86201C4.32029 2.73699 4.48986 2.66675 4.66667 2.66675H9.33333C10.0406 2.66675 10.7189 2.9477 11.219 3.4478C11.719 3.94789 12 4.62617 12 5.33341C12 6.04066 11.719 6.71894 11.219 7.21903C10.7189 7.71913 10.0406 8.00008 9.33333 8.00008"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                                <div className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M12.6667 2.66675H6.66669"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M9.33331 13.3333H3.33331"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M10 2.66675L6 13.3334"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <svg
                                  width="2"
                                  height="20"
                                  viewBox="0 0 2 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1 1L1 19"
                                    stroke="#E2E8F0"
                                    stroke-linecap="round"
                                  />
                                </svg>
                              </div>
                              <div>
                                <div className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M6.00002 7.33341C6.7364 7.33341 7.33335 6.73646 7.33335 6.00008C7.33335 5.2637 6.7364 4.66675 6.00002 4.66675C5.26364 4.66675 4.66669 5.2637 4.66669 6.00008C4.66669 6.73646 5.26364 7.33341 6.00002 7.33341Z"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M14 9.99996L11.9427 7.94263C11.6926 7.69267 11.3536 7.55225 11 7.55225C10.6464 7.55225 10.3074 7.69267 10.0573 7.94263L4 14"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <svg
                                  width="2"
                                  height="20"
                                  viewBox="0 0 2 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1 1L1 19"
                                    stroke="#E2E8F0"
                                    stroke-linecap="round"
                                  />
                                </svg>
                              </div>
                              <div className="flex">
                                <div className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10 8H2"
                                      stroke="#3B82F6"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M11.3333 12H2"
                                      stroke="#3B82F6"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M14 4H2"
                                      stroke="#3B82F6"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                                <div className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M11.3333 8H4.66663"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M12.6667 12H3.33337"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M14 4H2"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                                <div className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14 8H6"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M14 12H4.66663"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M14 4H2"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                                <div className="p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M2 8H14"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M2 12H14"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M2 4H14"
                                      stroke="#475569"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                          <label htmlFor="editor" className="sr-only">
                            Publish post
                          </label>
                          <textarea
                            id="editor"
                            rows={8}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="px-2 pt-2 block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                            placeholder="Write an article..."
                            required
                          ></textarea>
                        </div>
                      </div>
                      {/* <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="p-2 border rounded border-gray-300"
                        placeholder="Enter article content"
                      /> */}
                    </div>
                    <div className="flex justify-end gap-2">
                      <a href="/dashboard">
                        <div className="bg-gray-100 px-4 py-1 rounded border border-gray-200">
                          Cancel
                        </div>
                      </a>

                      <a href="">
                        <button
                          type="button"
                          className="bg-gray-400 text-white px-4 py-1 rounded"
                          onClick={() => router.push("/preview")}
                        >
                          Preview
                        </button>
                      </a>

                      <button
                        type="submit"
                        className="bg-[#2563EB] text-white px-4 py-1 rounded"
                      >
                        Upload
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddArticle;
