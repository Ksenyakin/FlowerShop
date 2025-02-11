package handlers

import (
	"encoding/json"
	"flower-shop-backend/models"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

// Добавление категории или подкатегории
func AddCategory(w http.ResponseWriter, r *http.Request) {
	var data struct {
		Name     string `json:"name"`
		ParentID *int   `json:"parent_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, `{"message": "Invalid input"}`, http.StatusBadRequest)
		return
	}

	id, err := models.AddCategory(data.Name, data.ParentID)
	if err != nil {
		http.Error(w, `{"message": "Failed to add category"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]int{"id": id})
}

// Получение всех категорий
func GetCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := models.GetCategories()
	if err != nil {
		http.Error(w, `{"message": "Failed to get categories"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(categories)
}

// Обновление категории
func UpdateCategory(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	categoryID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"message": "Invalid category ID"}`, http.StatusBadRequest)
		return
	}

	var data struct {
		Name     string `json:"name"`
		ParentID *int   `json:"parent_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, `{"message": "Invalid input"}`, http.StatusBadRequest)
		return
	}

	err = models.UpdateCategory(categoryID, data.Name, data.ParentID)
	if err != nil {
		http.Error(w, `{"message": "Failed to update category"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Category updated successfully"})
}
