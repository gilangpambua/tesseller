// // import axios from "axios";
// // import Cookies from "js-cookie";

// // export const loginUser = async (payload: {
// //   username: string;
// //   password: string;
// // }) => {
// //   try {
// //     const response = await axios.post(
// //       `${process.env.NEXT_PUBLIC_SELLER}/auth/login`,
// //       payload,
// //       {
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );

// //     const data = response.data;

// //     if (response.status === 200 && data.token && data.role) {
// //       console.log("Login success response:", data);

// //       const expirationTime = Date.now() + 86400000;
// //       Cookies.set("token", data.token, { expires: 1 });
// //       Cookies.set("tokenExpiration", expirationTime.toString(), { expires: 1 });
// //       return { success: true, token: data.token, role: data.role };
// //     } else {
// //       console.error("Login failed:", data);
// //       return { success: false, message: data.message || "Unknown error" };
// //     }
// //   } catch (error: any) {
// //     if (error.response) {
// //       // Server merespons dengan status selain 2xx
// //       console.error("Login failed:", error.response.data);
// //       return {
// //         success: false,
// //         message: error.response.data.message || "Login failed",
// //       };
// //     } else if (error.request) {
// //       // Tidak ada respons dari server
// //       console.error("No response from server:", error.request);
// //       return { success: false, message: "No response from server" };
// //     } else {
// //       // Error lain saat setting request
// //       console.error("Error:", error.message);
// //       return { success: false, message: error.message };
// //     }
// //   }
// // };
// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const AddArticle: React.FC = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [title, setTitle] = useState<string>("");
//   const [content, setContent] = useState<string>("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [imageUrl, setImageUrl] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [wordCount, setWordCount] = useState(0);
//   const router = useRouter();
//   const handleChangeWord = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const text = e.target.value;
//     setContent(text);
//     const words = text.split(/\s+/).filter((word: string) => word.length > 0);
//     setWordCount(words.length);
//   };
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_SELLER}/categories`
//         );
//         setCategories(res.data.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title || !content || !selectedCategory || !imageUrl) {
//       alert("Please fill in all fields.");
//       return;
//     }
//     const articleData = new FormData();
//     articleData.append("title", title);
//     articleData.append("content", content);
//     articleData.append("categoryId", selectedCategory);
//     articleData.append("image", imageUrl);

//     try {
//       const token = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("token="))
//         ?.split("=")[1];

//       if (!token) {
//         alert("You must be logged in to upload an article.");
//         return;
//       }
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_SELLER}/articles`,
//         articleData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//           // withCredentials: true,
//         }
//       );
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Error uploading article:", error);
//       alert("Failed to create article.");
//     }
//   };
//   const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     e.preventDefault();
//     document.cookie = "token=; path=/; max-age=0";
//     document.cookie = "role=; path=/; max-age=0";
//     router.push("/");
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     // Menambahkan tipe untuk parameter e
//     const file = e.target.files?.[0]; // Memastikan file ada
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (typeof reader.result === "string") {
//           // Memastikan hasilnya adalah string
//           setImagePreview(reader.result); // Set image preview hanya jika hasilnya string
//         }
//         setImageUrl(file);
//       };
//       reader.readAsDataURL(file); // Membaca file sebagai URL data
//     }
//   };

//   const handleDelete = () => {
//     setImagePreview(null);
//     setImageUrl(null);
//   };

//   const handleChange = () => {
//     // Menangani tombol Change dengan membuka dialog file
//     const inputElement = document.getElementById(
//       "dropzone-file"
//     ) as HTMLInputElement | null;
//     if (inputElement) {
//       inputElement.click();
//     }
//   };

//   return (
//     <div>
//       <div className="grid h-screen sm:h-screen md:flex">
//         <div
//           className={`w-screen bg-[#2563EB] text-white flex flex-col p-4 md:flex sm:flex md:w-[250px] md:px-[30px] ${
//             isSidebarOpen ? "block" : "hidden"
//           } md:block sm:block`}
//           id="sideNav"
//         >

//           </div>
//           <div className="pt-[20px]">
//             <nav className="grid gap-[20px] text-[14px]">
//               <a
//                 className="block text-white rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
//                 href="/dashboard"
//               >
//                 Articles
//               </a>
//               <a
//                 className="block text-white rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
//                 href="/category"
//               >
//                 Category
//               </a>
//               <a
//                 className="block text-white rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </a>
//             </nav>
//           </div>
//         </div>

//         <div className="w-screen flex-1 flex flex-col bg-gray-100">
//           <div className="bg-white shadow-md flex justify-between p-4 items-center">
//             <div className="flex items-center gap-[15px]">
//               <div className="md:hidden flex items-center">
//                 <button
//                   id="menuBtn"
//                   onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                 >
//                   <span className="text-gray-500 text-lg">&#9776;</span>
//                 </button>
//               </div>
//               <div className="flex items-center">
//                 <span className="font-bold text-xl">Create Articles</span>
//               </div>
//             </div>
//             <div className="space-x-5 flex items-center">
//               <a href="/profile">
//                 {" "}
//                 <button>
//                   <span className="text-gray-500 text-lg">👤</span>
//                 </button>
//               </a>
//             </div>
//           </div>
//           <div className="p-[12px]">
//             <div className="bg-white rounded-lg">
//               {" "}
//               <div className="pt-[10px] pb-2 overflow:hidden">
//                 <div className="bg-white text-sm text-gray-700 rounded-lg flex px-4 gap-2">
//                   <div className="flex items-center">

//                   </div>
//                   <div className="bg-white text-sm text-gray-700 py-2 rounded-lg">
//                     Create Articles
//                   </div>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <div className="relative max-w-md gap-[8px]">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                       <label className="block text-gray-700">Thumbnails</label>
//                       <div className="items-center justify-center">
//                         <label
//                           htmlFor="dropzone-file"
//                           className="flex flex-col items-center justify-center w-[223px] h-[163px] px-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative"
//                         >
//                           {/* Gambar Preview */}
//                           {imagePreview ? (
//                             <img
//                               src={imagePreview}
//                               alt="Image Preview"
//                               className="w-full h-full object-cover rounded-lg"
//                             />
//                           ) : (
//                             <div className="flex flex-col items-center justify-center pt-5 pb-6">

//                               <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                                 <span className="font-semibold">
//                                   Click to upload
//                                 </span>{" "}
//                                 or drag and drop
//                               </p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 SVG, PNG, JPG or GIF (MAX. 800x400px)
//                               </p>
//                             </div>
//                           )}
//                           <input
//                             id="dropzone-file"
//                             type="file"
//                             className="hidden"
//                             onChange={handleFileChange}
//                           />
//                         </label>

//                         {/* Delete and Change Buttons Below the Image */}
//                         {imagePreview && (
//                           <div className="flex justify-center space-x-4">
//                             <div
//                               onClick={handleDelete}
//                               className="text-red-500"
//                             >
//                               Delete
//                             </div>
//                             <div
//                               onClick={handleChange}
//                               className="text-blue-500"
//                             >
//                               Change
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="grid">
//                       <label className="text-gray-700">Title</label>
//                       <input
//                         type="text"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         className="p-2 border rounded border-gray-300"
//                         placeholder="Enter article title"
//                       />
//                     </div>
//                     <div className="grid">
//                       <label className="block text-gray-700">Category</label>
//                       <select
//                         className="p-2 border rounded border-gray-300"
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                       >
//                         <option value="">Select category</option>
//                         {categories.length > 0 ? (
//                           categories.map((cat) => (
//                             <option key={cat.id} value={cat.id}>
//                               {cat.name}
//                             </option>
//                           ))
//                         ) : (
//                           <option disabled>No categories available</option>
//                         )}
//                       </select>
//                     </div>
//                     <div className="grid">
//                       <label className="block text-gray-700">Content</label>
//                       <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
//                         <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600">
//                           <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
//                             <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
//                               <div className="flex gap-[4px]">

//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
//                           <label htmlFor="editor" className="sr-only">
//                             Publish post
//                           </label>
//                           <textarea
//                             id="editor"
//                             rows={8}
//                             value={content}
//                             onChange={(e) => setContent(e.target.value)}
//                             className="px-2 pt-2 block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
//                             placeholder="Write an article..."
//                             required
//                           ></textarea>
//                         </div>
//                       </div>

//                     </div>
//                     <div className="flex justify-end gap-2">
//                       <a href="/dashboard">
//                         <div className="bg-gray-100 px-4 py-1 rounded border border-gray-200">
//                           Cancel
//                         </div>
//                       </a>

//                       <a href="">
//                         <button
//                           type="button"
//                           className="bg-gray-400 text-white px-4 py-1 rounded"
//                           onClick={() => router.push("/preview")}
//                         >
//                           Preview
//                         </button>
//                       </a>

//                       <button
//                         type="submit"
//                         className="bg-[#2563EB] text-white px-4 py-1 rounded"
//                       >
//                         Upload
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddArticle;
