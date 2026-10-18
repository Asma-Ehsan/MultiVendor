import { navItems } from '../../static/data'
import {Link} from "react-router-dom"

const Navbar = ({active}) => {
  return (
    <div className="flex flex-col px-2 800px:px-0 800px:flex-row 800px:items-center 800px:gap-6 font-jakarta">
        {
            navItems && navItems.map((i, index) => (
                <div className="flex" key={index}>
                    <Link to = {i.url}
                      className= {`${
                        active === index + 1
                          ? "text-primary font-bold bg-primary-fixed/40 800px:bg-transparent 800px:after:scale-x-100"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low 800px:hover:bg-transparent 800px:after:scale-x-0 800px:hover:after:scale-x-100"
                      } relative block w-full 800px:w-auto px-4 py-3 800px:px-0 800px:py-0 rounded-xl 800px:rounded-none text-label-md cursor-pointer transition-colors duration-200 800px:after:absolute 800px:after:left-0 800px:after:right-0 800px:after:-bottom-[6px] 800px:after:h-0.5 800px:after:bg-primary 800px:after:origin-left 800px:after:transition-transform 800px:after:duration-300`}>
                        {i.title}
                      </Link>
                </div>
            ))
        }
      
    </div>
  )
}

export default Navbar