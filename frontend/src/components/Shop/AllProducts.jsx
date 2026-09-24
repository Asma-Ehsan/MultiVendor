import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProductsShop } from "../../redux/actions/product";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";

const AllProducts = () => {
  const { seller } = useSelector((state) => state.seller);
  const { products, isLoading } = useSelector((state) => state.products,);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);
  
  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80, //smallest width in pixels.
      flex: 0.5, //it is share of the free space
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      headerName: "Preview",
      type: "number",
      minWidth: 100,
      flex: 0.8,
      // disables sorting for that column, so clicking its header won't reorder the rows.
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      headerName: "Delete",
      type: "number",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
          {/* params get the id from your row array: id: item._id, */}
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: 10,
      });
    });
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          {/* DataGrid is a ready-made table component from the library @mui/x-data-grid */}
          <DataGrid
            rows={row}
            columns={columns}
            pageSizeOptions={[10]} // the user can only choose 10 rows per page.
            initialState={{
              pagination: {
                // sets the starting state: page 0 (the first page) with 10 rows.
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            disableRowSelectionOnClick //to stop rows from being selected when clicked.
            autoHeight //makes the table as tall as its rows
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;
