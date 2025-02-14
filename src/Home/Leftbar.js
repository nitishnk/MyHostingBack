import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

function Leftbar({ setCurrentCategory }) { 
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  const variants = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("🔍 Leftbar.js Token Check:", token);

    if (!token) {
      console.warn("⚠️ No token found. Redirecting to login...");
      navigate("/login");
      return;
    }

    fetchCategories(token);
  }, []);

  async function fetchCategories() {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      console.warn("⚠️ No token found. Skipping category fetch.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3002/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 401 || response.status === 403) {
        console.error("🔴 Unauthorized. Invalid token. Logging out...");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
  
      if (!response.ok) throw new Error(`Error fetching categories: ${response.status}`);
  
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("⚠️ Fetch Categories Failed:", error.message);
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const addedCategory = await response.json();
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
      setNewCategory("");
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error adding category:", error);
      alert("Failed to add category.");
    }
  }

  return (
    <>
      <ListGroup className="leftbar">
        <ListGroup.Item 
          action 
          variant="primary" 
          className="d-flex justify-content-between align-items-center"
        >
          Categories
          <Button variant="light" size="sm" onClick={() => setShowModal(true)}>+</Button>
        </ListGroup.Item>

        {categories.length > 0 ? (
          categories.map((category) => (
            <ListGroup.Item
              key={category._id}
              action
              variant={variants[Math.floor(Math.random() * variants.length)]}
              onClick={() => setCurrentCategory(category.name)}
            >
              {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
            </ListGroup.Item>
          ))
        ) : (
          <p className="text-center text-muted mt-3">Loading categories...</p>
        )}
      </ListGroup>

      {/* Add New Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCategory}>
            <Form.Group>
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">Add</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Leftbar;
