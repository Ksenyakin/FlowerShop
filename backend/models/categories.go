package models

import "flower-shop-backend/utils"

type Category struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description *string `json:"description"` // Добавляем описание
	ParentID    *int    `json:"parent_id"`   // Может быть NULL
}

// Добавление категории
func AddCategory(name string, parentID *int) (int, error) {
	var id int
	query := `INSERT INTO categories (name, parent_id) VALUES ($1, $2) RETURNING id`
	err := utils.DB.QueryRow(query, name, parentID).Scan(&id)
	return id, err
}

// Получение всех категорий
func GetCategories() ([]Category, error) {
	rows, err := utils.DB.Query(`SELECT id, name, parent_id FROM categories`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var c Category
		err := rows.Scan(&c.ID, &c.Name, &c.ParentID)
		if err != nil {
			return nil, err
		}
		categories = append(categories, c)
	}
	return categories, nil
}

// Обновление категории
func UpdateCategory(id int, name string, parentID *int) error {
	query := `UPDATE categories SET name = $1, parent_id = $2 WHERE id = $3`
	_, err := utils.DB.Exec(query, name, parentID, id)
	return err
}
