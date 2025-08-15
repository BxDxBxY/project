// import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
// import {
//   ApiResponse,
//   PaginatedResponse,
//   LoginCredentials,
//   AuthTokens,
//   User,
//   Category,
//   Term,
//   CreateTermData,
//   UpdateTermData,
//   CreateCategoryData,
//   UpdateCategoryData,
//   ApiError,
//   CreateUserData,
// } from "@/types";

// // Environment configuration
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://13.49.18.4:8000";

// interface ErrorResponse {
//   code?: string;
//   message?: string;
//   // Add other properties that you expect in the error response
// }

// // Token management
// class TokenManager {
//   private static getStorage(): Storage | null {
//     if (typeof window !== "undefined") {
//       return window.localStorage;
//     }
//     return null;
//   }

//   static getAccessToken(): string | null {
//     const storage = this.getStorage();
//     return storage?.getItem("accessToken") || null;
//   }

//   static getRefreshToken(): string | null {
//     const storage = this.getStorage();
//     return storage?.getItem("refreshToken") || null;
//   }

//   static setTokens(access: string, refresh: string): void {
//     const storage = this.getStorage();
//     if (storage) {
//       storage.setItem("accessToken", access);
//       storage.setItem("refreshToken", refresh);
//     }
//   }

//   static clearTokens(): void {
//     const storage = this.getStorage();
//     if (storage) {
//       storage.removeItem("accessToken");
//       storage.removeItem("refreshToken");
//     }
//   }
// }

// // API client configuration
// class ApiClient {
//   private client: AxiosInstance;
//   private isRefreshing = false;
//   private failedQueue: Array<{
//     resolve: (value: any) => void;
//     reject: (error: any) => void;
//   }> = [];

//   constructor() {
//     this.client = axios.create({
//       baseURL: API_BASE_URL,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       timeout: 10000,
//     });

//     this.setupInterceptors();
//   }

//   private setupInterceptors(): void {
//     // Request interceptor
//     this.client.interceptors.request.use(
//       (config) => {
//         // Only add auth token for POST, PUT, DELETE requests as per Swagger
//         const requiresAuth = ["POST", "PUT", "DELETE"].includes(
//           config.method?.toUpperCase() || ""
//         );
//         if (requiresAuth) {
//           const token = TokenManager.getAccessToken();
//           if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//           }
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor
//     this.client.interceptors.response.use(
//       (response: AxiosResponse) => response,
//       async (error: AxiosError) => {
//         const originalRequest = error.config as any;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//           const responseData = error.response.data as ErrorResponse;

//           if (responseData.code === "token_not_valid") {
//             TokenManager.clearTokens();
//             window.location.href = "/admin/login"; // replace prevents back nav
//           }
//           if (this.isRefreshing) {
//             return new Promise((resolve, reject) => {
//               this.failedQueue.push({ resolve, reject });
//             });
//           }

//           originalRequest._retry = true;
//           this.isRefreshing = true;

//           try {
//             const refreshToken = TokenManager.getRefreshToken();
//             if (!refreshToken) {
//               TokenManager.clearTokens();
//               if (typeof window !== "undefined") {
//                 window.location.replace("/admin/login"); // replace prevents back nav
//               }
//               throw new Error("No refresh token available");
//             }

//             const response = await this.client.post<AuthTokens>(
//               "/auth/token/refresh/",
//               {
//                 refresh: refreshToken,
//               }
//             );

//             const { access, refresh } = response.data;
//             TokenManager.setTokens(access, refresh);

//             // Retry failed requests
//             this.failedQueue.forEach(({ resolve }) =>
//               resolve(this.client(originalRequest))
//             );
//             this.failedQueue = [];

//             return this.client(originalRequest);
//           } catch (refreshError) {
//             TokenManager.clearTokens();
//             this.failedQueue.forEach(({ reject }) => reject(refreshError));
//             this.failedQueue = [];

//             // Redirect to login if needed
//             if (typeof window !== "undefined") {
//               window.location.href = "/admin/login";
//             }

//             return Promise.reject(refreshError);
//           } finally {
//             this.isRefreshing = false;
//           }
//         }

//         return Promise.reject(error);
//       }
//     );
//   }

//   // Generic request method with error handling
//   private async request<T>(config: any): Promise<T> {
//     try {
//       const response = await this.client(config);
//       // console.log(response);
//       return response.data;
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       const apiError: ApiError = {
//         message:
//           (axiosError.response?.data as any)?.message ||
//           axiosError.message ||
//           "An error occurred",
//         status: axiosError.response?.status || 500,
//         details: axiosError.response?.data,
//       };
//       throw apiError;
//     }
//   }

//   // Authentication methods - Match Swagger exactly
//   async login(credentials: LoginCredentials): Promise<AuthTokens> {
//     return this.request<AuthTokens>({
//       method: "POST",
//       url: "/auth/token/",
//       data: credentials,
//     });
//   }

//   async refreshToken(refresh: string): Promise<AuthTokens> {
//     return this.request<AuthTokens>({
//       method: "POST",
//       url: "/auth/token/refresh/",
//       data: { refresh },
//     });
//   }

//   async verifyToken(
//     token: string
//   ): Promise<{ detail?: string; code?: string }> {
//     return axios.post(API_BASE_URL + "/auth/token/verify/", { token });
//     return this.request<{ detail?: string; code?: string }>({
//       method: "POST",
//       url: "/auth/token/verify/",
//       data: { token },
//     });
//   }

//   // Category methods - Match Swagger exactly
//   async fetchCategories(): Promise<Category[]> {
//     return this.request<Category[]>({
//       method: "GET",
//       url: "/dictionary/category/",
//     });
//   }

//   async fetchCategory(id: number): Promise<Category> {
//     return this.request<Category>({
//       method: "GET",
//       url: `/dictionary/category/${id}/`,
//     });
//   }

//   async createCategory(data: CreateCategoryData): Promise<Category> {
//     return this.request<Category>({
//       method: "POST",
//       url: "/dictionary/create_category/",
//       data,
//     });
//   }

//   async updateCategory(
//     id: number,
//     data: UpdateCategoryData
//   ): Promise<Category> {
//     return this.request<Category>({
//       method: "PUT",
//       url: `/dictionary/create_category/${id}/`,
//       data,
//     });
//   }
//   async deleteCategory(id: number): Promise<void> {
//     // console.log(id);
//     return this.request<void>({
//       method: "DELETE",
//       url: `/dictionary/create_category/${id}/`,
//     });
//   }

//   // Term methods - Match Swagger exactly
//   async fetchTerms(): Promise<Term[]> {
//     return this.request<Term[]>({
//       method: "GET",
//       url: "/dictionary/term/",
//     });
//   }

//   async fetchTerm(id: number): Promise<Term> {
//     return this.request<Term>({
//       method: "GET",
//       url: `/dictionary/term/${id}/`,
//     });
//   }
//   async fetchTermPhoto(id: number): Promise<any> {
//     // console.log(id);
//     return this.request<any>({
//       method: "GET",
//       url: `/dictionary/term_photo/${id}/`,
//     });
//   }

//   async createTerm(data: CreateTermData): Promise<Term> {
//     // Handle file upload for photo field
//     const formData = new FormData();
//     formData.append("title", data.title);
//     formData.append("definition", data.definition);
//     // formData.append("categories", data.categories);

//     // if (data.) {
//     //   formData.append("photo", data.photo);
//     // }
//     if (data.categories) {
//       if (data.categories.length > 0) {
//         data.categories.forEach((catId) => {
//           formData.append("related_terms", catId.toString());
//         });
//       }
//     }
//     if (data.related_terms) {
//       if (data.related_terms.length > 0) {
//         data.related_terms.forEach((termId) => {
//           formData.append("related_terms", termId.toString());
//         });
//       }
//     }

//     return this.request<Term>({
//       method: "POST",
//       url: "/dictionary/create_term/",
//       data: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   }

//   async updateTerm(id: number, data: UpdateTermData): Promise<Term> {
//     // Handle file upload for photo field
//     const formData = new FormData();

//     if (data.title !== undefined) {
//       formData.append("title", data.title);
//     }
//     if (data.definition !== undefined) {
//       formData.append("definition", data.definition);
//     }
//     if (data.categories !== undefined) {
//       formData.append("category", data.categories?.toString() || "");
//     }
//     if (data.photo !== undefined) {
//       if (data.photo) {
//         formData.append("photo", data.photo);
//       }
//     }
//     if (data.related_terms !== undefined) {
//       data.related_terms?.forEach((termId) => {
//         formData.append("related_terms", termId.toString());
//       });
//     }

//     return this.request<Term>({
//       method: "PUT",
//       url: `/dictionary/create_term/${id}/`,
//       data: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   }

//   async deleteTerm(id: number): Promise<void> {
//     return this.request<void>({
//       method: "DELETE",
//       url: `/dictionary/create_term/${id}/`,
//     });
//   }

//   // User management methods
//   async fetchUsers(): Promise<User[]> {
//     return this.request<User[]>({
//       method: "GET",
//       url: "/dictionary/user_list/",
//     });
//   }

//   async createUser(data: CreateUserData): Promise<User> {
//     return this.request<User>({
//       method: "POST",
//       url: "/dictionary/user_create/",
//       data,
//     });
//   }

//   async updateUser(id: number, data: Partial<User>): Promise<User> {
//     return this.request<User>({
//       method: "PUT",
//       url: `/dictionary/user_update/${id}/`,
//       data,
//     });
//   }

//   async deleteUser(id: number): Promise<void> {
//     return this.request<void>({
//       method: "DELETE",
//       url: `/dictionary/user_delete/${id}/`,
//     });
//   }
// }

// // Export singleton instance
// export const apiClient = new ApiClient();

// // Export individual functions for backward compatibility
// export const login = (credentials: LoginCredentials) =>
//   apiClient.login(credentials);
// export const refreshToken = (refresh: string) =>
//   apiClient.refreshToken(refresh);
// export const verifyToken = (token: string) => apiClient.verifyToken(token);

// export const fetchCategories = () => apiClient.fetchCategories();
// export const fetchCategory = (id: number) => apiClient.fetchCategory(id);
// export const createCategory = (data: CreateCategoryData) =>
//   apiClient.createCategory(data);
// export const updateCategory = (id: number, data: UpdateCategoryData) =>
//   apiClient.updateCategory(id, data);
// export const deleteCategory = (id: number) => apiClient.deleteCategory(id);

// export const fetchTermPhoto = (id: number) => apiClient.fetchTermPhoto(id);
// export const fetchTerms = () => apiClient.fetchTerms();
// export const fetchTerm = (id: number) => apiClient.fetchTerm(id);
// export const createTerm = (data: CreateTermData) => apiClient.createTerm(data);
// export const updateTerm = (id: number, data: UpdateTermData) =>
//   apiClient.updateTerm(id, data);
// export const deleteTerm = (id: number) => apiClient.deleteTerm(id);

// export const fetchUsers = () => apiClient.fetchUsers();
// export const createUser = (data: CreateUserData) => apiClient.createUser(data);
// export const updateUser = (id: number, data: Partial<User>) =>
//   apiClient.updateUser(id, data);
// export const deleteUser = (id: number) => apiClient.deleteUser(id);

// // Export token manager for direct access
// export { TokenManager };
