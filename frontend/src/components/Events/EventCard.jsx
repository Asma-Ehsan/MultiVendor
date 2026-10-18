import CountDown from "./CountDown"
import { getImageUrl } from '../../server'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addToCart } from '../../redux/actions/cart'
import { AiOutlineShoppingCart } from "react-icons/ai"
import { IoIosArrowForward } from "react-icons/io"

const EventCard = ({active, data}) => {
  const {cart} = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExist = cart && cart.find((i) => i._id === data._id);

    if(isItemExist){
      toast.error("Item already in cart!");
    }else{
      if(data.stock < 1){
        toast.error("Product stock limited!");
      }else{
        const cartData = {...data, qty: 1};
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  }

  return (
    <div className={`w-full rounded-3xl bg-surface-container-lowest border border-surface-container/80 shadow-[0_8px_30px_rgba(11,28,48,0.05)] overflow-hidden ${active ? "unset" : "mb-10"} font-jakarta`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left: event image */}
        <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[480px] bg-surface-container-low overflow-hidden group">
          <img
            src= {getImageUrl(data?.images?.[0])}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white/60 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="text-label-sm uppercase tracking-wider text-on-surface font-bold">
              Limited Event
            </span>
          </div>
        </div>

        {/* Right: details */}
        <div className="lg:col-span-6 p-4 sm:p-6 lg:p-10 flex flex-col justify-center space-y-4">
          <div className="space-y-1">
            <span className="text-label-sm uppercase tracking-wider text-tertiary font-bold">
              Special Offer
            </span>
            <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              {data?.name}
            </h2>
            <p className="text-body-md text-secondary leading-relaxed line-clamp-4">
              {data?.description}
            </p>
          </div>

          {/* Price and timer box */}
          <div className="p-4 rounded-2xl bg-surface-container-low/80 border border-surface-container flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-label-sm text-secondary uppercase tracking-wider block font-semibold">
                Event Price
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h5 className="text-[26px] text-primary font-bold">{data?.discountPrice} $</h5>
                <h5 className="text-body-md text-outline line-through">{data?.originalPrice} $</h5>
              </div>
              <span className="text-body-sm font-medium text-[#3bc177]">
                {data?.sold_out} sold
              </span>
            </div>
            <CountDown data = {data} />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-primary transition-all duration-200 text-label-md shadow-md hover:shadow-lg flex items-center gap-2"
              onClick={() => addToCartHandler(data)}
            >
              <AiOutlineShoppingCart size={18} />
              <span>Add to Cart</span>
            </button>
            <Link
              to = {`/product/${data._id}?isEvent=true;`}
              className="group px-4 py-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-all duration-200 text-label-md flex items-center gap-1 border border-surface-variant/40"
            >
              <span>See Details</span>
              <IoIosArrowForward className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default EventCard