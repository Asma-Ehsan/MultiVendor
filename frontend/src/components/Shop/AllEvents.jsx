import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import Loader from "../Layout/Loader";
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
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full min-w-0 p-space-md 800px:p-space-lg">
          {/* ---------- Page heading ---------- */}
          <div className="mb-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Marketing
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              All Events
            </h2>
            <p className="font-body-md text-body-md text-secondary mt-1">
              Manage the events and flash sales running in your shop.
            </p>
          </div>

          {/* ---------- Card ---------- */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
            {row.length === 0 ? (
              <div className="p-10 text-center text-body-md font-body-md text-secondary">
                You have no events yet.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead>
                      <tr className="bg-surface-container-low/70 border-b border-surface-container text-label-sm font-label-sm uppercase tracking-wider text-secondary">
                        <th className="py-3.5 px-6" scope="col">Event ID</th>
                        <th className="py-3.5 px-6" scope="col">Name</th>
                        <th className="py-3.5 px-6" scope="col">Price</th>
                        <th className="py-3.5 px-6 text-center" scope="col">Stock</th>
                        <th className="py-3.5 px-6 text-center" scope="col">Sold Out</th>
                        <th className="py-3.5 px-6 text-center" scope="col">Preview</th>
                        <th className="py-3.5 px-6 text-center" scope="col">Delete</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-surface-container">
                      {row.map((item) => (
                        <tr
                          key={item.id}
                          className="group hover:bg-surface-container-low/70 transition-colors duration-150"
                        >
                          {/* Event ID */}
                          <td className="py-4 px-6">
                            <span className="block max-w-[140px] truncate text-body-sm font-body-sm font-medium tracking-wide text-on-surface">
                              <span className="text-outline">#</span>
                              {item.id}
                            </span>
                          </td>

                          {/* Name */}
                          <td className="py-4 px-6">
                            <span className="block max-w-[260px] truncate text-body-md font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                              {item.name}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-6 text-body-md font-body-md font-semibold text-on-surface whitespace-nowrap">
                            {item.price}
                          </td>

                          {/* Stock */}
                          <td className="py-4 px-6 text-center text-body-md font-body-md font-semibold text-secondary">
                            {item.Stock}
                          </td>

                          {/* Sold */}
                          <td className="py-4 px-6 text-center text-body-md font-body-md font-semibold text-secondary">
                            {item.sold}
                          </td>

                          {/* Preview */}
                          <td className="py-4 px-6 text-center">
                            <Link
                              to={`/product/${item.id}?isEvent=true`}
                              aria-label="Preview event"
                              className="p-2 text-secondary hover:text-primary hover:bg-primary-fixed/60 rounded-lg transition-colors inline-flex items-center justify-center"
                            >
                              <AiOutlineEye
                                size={20}
                                className="transition-transform group-hover:scale-110"
                              />
                            </Link>
                          </td>

                          {/* Delete */}
                          <td className="py-4 px-6 text-center">
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              aria-label="Delete event"
                              className="p-2 text-secondary hover:text-error hover:bg-error-container/60 rounded-lg transition-colors inline-flex items-center justify-center"
                            >
                              <AiOutlineDelete
                                size={20}
                                className="transition-transform group-hover:scale-110"
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table footer */}
                <div className="px-6 py-4 border-t border-surface-container text-label-md font-label-md text-secondary">
                  Showing <span className="font-bold text-on-surface">{row.length}</span> events
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default AllEvents