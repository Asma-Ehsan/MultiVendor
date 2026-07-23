import { Button } from "@mui/material";
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";

const AllEvents = () => {
    const {seller} = useSelector((state) => state.seller);
    const {events, isLoading } =  useSelector((state) => state.events);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllEventsShop(seller._id));
    },[dispatch])

    const handleDelete = (id) => {
        dispatch(deleteEvent(id));
        window.location.reload();
    }
   
    const columns = [
        {field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7},
        {field: "name", headerName: "Name", minWidth: 180, flex: 1.4},
        {field: "price", headerName: "Price", minWidth: 100, flex: 0.6},
        {field: "Stock", headerName: "Stock",  type: "number", minWidth: 80, flex: 0.5},
        { field: "sold", headerName: "Sold out", type: "number", minWidth: 130, flex: 0.6,},
        { field: "Preview", headerName: "Preview", type: "number", minWidth: 100, flex: 0.8, sortable: false,
            renderCell: (params) => {
                const d = params.row.name;
                const product_name = d.replace(/\s+/g, "-");
                return (
                    <>
                    <Link to ={`/product/${product_name}`}>
                    <Button>
                        <AiOutlineEye size={20}/>
                    </Button>
                    </Link>
                    </>
                )
            }
        },
        { field: "Delete", headerName: "Delete", type: "number", minWidth: 120, flex: 0.8, sortable: false,
            renderCell: (params) => {
                const d = params.row.name;
                const product_name = d.replace(/\s+/g, "-");
                return (
                    <>
                    
                    <Button 
                    onClick={() => handleDelete(params.id)}
                    >
                        <AiOutlineDelete size={20}/>
                    </Button>
                    </>
                )
            }
        },
    ];

    const row = [];
    events && events.forEach((item) => {
        row.push({
            id: item._id,
            name: item.name,
            price: "US$ " + item.discountPrice,
            Stock: item.stock,
            sold: 10,
        })
    })
  return (
    <>
     {
        isLoading
        ? (
        <Loader/>
    ): (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <DataGrid
        rows = {row}
        columns = {columns}
        pageSizeOptions={[10]}
        initialState={{
            pagination: {
                paginationModel: { pageSize: 10, page: 0 },
            },
        }}
        disableSelectionOnClick
        autoHeight
            />
    </div>
    )  
    }
    </>
  )
}

export default AllEvents