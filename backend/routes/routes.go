package routes

import (
	"flower-shop-backend/handlers"
	"flower-shop-backend/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()

	// Пользователи
	r.HandleFunc("/api/register", handlers.RegisterUser).Methods("POST")  //
	r.HandleFunc("/api/login", handlers.LoginUser).Methods("POST")        //
	r.HandleFunc("/api/userinfo", handlers.GetUserInfo).Methods("GET")    //
	r.HandleFunc("/api/update_user", handlers.UpdateUser).Methods("POST") //

	// Товары
	r.HandleFunc("/api/products", handlers.GetProducts).Methods("GET") //
	r.HandleFunc("/api/products/{id}", handlers.GetProductByID).Methods("GET")
	r.HandleFunc("/api/addProduct", handlers.AddProduct).Methods("POST")             //
	r.HandleFunc("/api/products/{id:[0-9]+}", handlers.UpdateProduct).Methods("PUT") //
	r.HandleFunc("/api/products/{id}", handlers.DeleteProduct).Methods("DELETE")

	r.HandleFunc("/admin/products", handlers.GetProducts).Methods("GET")               //
	r.HandleFunc("/admin/products/{id}", handlers.GetProductByID).Methods("GET")       //
	r.HandleFunc("/admin/addProduct", handlers.AddProduct).Methods("POST")             //
	r.HandleFunc("/admin/products/{id:[0-9]+}", handlers.UpdateProduct).Methods("PUT") //
	r.HandleFunc("/admin/products/{id}", handlers.DeleteProduct).Methods("DELETE")     //

	// Категории
	r.HandleFunc("/api/categories", handlers.GetCategories).Methods("GET")
	r.HandleFunc("/api/categories", middleware.RequireAdmin(handlers.AddCategory)).Methods("POST")
	r.HandleFunc("/api/categories/{id}", middleware.RequireAdmin(handlers.UpdateCategory)).Methods("PUT")

	// Категории Товаров
	r.HandleFunc("/api/products/{product_id}/categories", handlers.GetCategoriesForProduct).Methods("GET")             //
	r.HandleFunc("/api/products/{product_id}/categories/{category_id}", handlers.AddCategoryToProduct).Methods("POST") //
	r.HandleFunc("/api/products/{product_id}/categories", handlers.RemoveCategoryFromProduct).Methods("DELETE")        //

	// Корзина
	r.HandleFunc("/api/cart/{user_id:[0-9]+}/view", handlers.ViewCartHandler).Methods("GET")  //
	r.HandleFunc("/api/cart/{user_id:[0-9]+}/add", handlers.AddToCartHandler).Methods("POST") //
	r.HandleFunc("/api/cart/{user_id:[0-9]+}/clear", handlers.ClearCartHandler).Methods("POST")
	r.HandleFunc("/api/cart/update/{cart_item_id:[0-9]+}", handlers.UpdateCartItemHandler).Methods("POST")
	r.HandleFunc("/api/cart/remove/{cart_item_id:[0-9]+}", handlers.RemoveFromCartHandler).Methods("DELETE")

	// Заказы
	r.HandleFunc("/api/orders", handlers.CreateOrder).Methods("POST")
	r.HandleFunc("/api/orders/{order_id:[0-9]+}", handlers.GetOrder).Methods("GET")

	// Платежи
	r.HandleFunc("/api/pay", handlers.ProcessPayment).Methods("POST")
	r.HandleFunc("/api/purchase/{id}", handlers.ProcessPurchaseHandler).Methods("POST")

	r.HandleFunc("/api/upload", middleware.RequireAdmin(handlers.UploadHandler)).Methods("POST")
	r.HandleFunc("/api/images", handlers.GetImages).Methods("GET")

	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("uploads"))))

	return r
}