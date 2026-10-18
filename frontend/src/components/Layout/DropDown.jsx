import { useNavigate } from 'react-router-dom'
import { IoIosArrowForward } from "react-icons/io";

const DropDown = ({categoriesData, setDropDown}) => {
    const navigate = useNavigate();
    const submitHandle = (i) => {
        navigate(`/products?category=${i.title}`);
        setDropDown(false)
        window.location.reload();
    }
  return (
    <div className="absolute top-full left-0 mt-2 w-[260px] max-h-[70vh] overflow-y-auto py-2 bg-surface-container-lowest border border-surface-container rounded-2xl shadow-xl z-30 font-jakarta">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <div
            key={index}
            className="group flex items-center gap-3 mx-2 px-2 py-2 rounded-xl cursor-pointer hover:bg-primary-fixed/60 transition-colors duration-200"
            onClick={() => submitHandle(i)}
          >
            <div className="w-9 h-9 shrink-0 rounded-lg bg-surface-container-low group-hover:bg-surface-container-lowest flex items-center justify-center transition-colors duration-200">
              <img
                src={i.image_Url}
                className="w-6 h-6 object-contain select-none group-hover:scale-110 transition-transform duration-200"
                alt=""
              />
            </div>
            <h3 className="flex-1 text-body-md font-semibold text-on-surface group-hover:text-primary cursor-pointer select-none transition-colors duration-200">
              {i.title}
            </h3>
            <IoIosArrowForward
              size={16}
              className="text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            />
          </div>
        ))}
    </div>
  )
}

export default DropDown