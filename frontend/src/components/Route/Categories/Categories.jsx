import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 mt-10 hidden sm:block font-jakarta">
        <div className="branding grid grid-cols-2 lg:grid-cols-4 gap-5">
          {brandingData &&
            brandingData.map((i, index) => (
              <div
                className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-surface-container/80 shadow-[0_2px_12px_-2px_rgba(11,28,48,0.03)] hover:shadow-md hover:border-primary-fixed hover:-translate-y-0.5 transition-all duration-300"
                key={index}
              >
                {i.icon}
                <div>
                  <h3 className="text-[15px] font-bold text-on-surface leading-tight">
                    {i.title}
                  </h3>
                  <p className="text-body-sm text-secondary mt-0.5">
                    {i.Description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories */}
      <div
        className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 mt-10 mb-10 font-jakarta"
        id="categories"
      >
        <div className="mb-4">
          <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
            Curated Collections
          </span>
          <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <div
                  className="group flex flex-col items-center p-4 bg-surface-container-lowest rounded-2xl border border-surface-container/70 shadow-[0_2px_8px_-2px_rgba(11,28,48,0.03)] hover:shadow-lg hover:border-primary-fixed hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer overflow-hidden"
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center p-2 mb-2 group-hover:bg-primary-fixed/80 group-hover:scale-110 transition-all duration-300">
                    <img
                      src={i.image_Url}
                      className="w-full h-full object-contain"
                      alt=""
                    />
                  </div>
                  <h5 className="text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                    {i.title}
                  </h5>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;