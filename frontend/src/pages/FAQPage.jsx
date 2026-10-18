import { useEffect, useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";

const faqData = [
  {
    id: 2,
    icon: "assignment_return",
    category: "Returns & Refunds",
    question: "What is your return policy?",
    answer:
      "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@myecommercestore.com with your order number and a brief explanation of why you're returning the item.",
  },
  {
    id: 3,
    icon: "local_shipping",
    category: "Orders & Tracking",
    question: "How do I track my order?",
    answer:
      "You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details.",
  },
  {
    id: 4,
    icon: "headset_mic",
    category: "Customer Support",
    question: "How do I contact customer support?",
    answer:
      "You can contact our customer support team by emailing us at support@myecommercestore.com, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EST, Monday through Friday.",
  },
  {
    id: 5,
    icon: "edit_note",
    category: "Orders & Tracking",
    question: "Can I change or cancel my order?",
    answer:
      "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items you've ordered, you can return them for a refund within 30 days of delivery.",
  },
  {
    id: 6,
    icon: "public",
    category: "Shipping & Delivery",
    question: "Do you offer international shipping?",
    answer: "Currently, we only offer shipping within the United States.",
  },
  {
    id: 7,
    icon: "payments",
    category: "Payments & Security",
    question: "What payment methods do you accept?",
    answer:
      "We accept visa,mastercard,paypal payment method also we have cash on delivery system.",
  },
];

const FAQPage = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  },[])
  
  return (
    <div className="bg-background font-jakarta">
      <Header activeHeading={5} />
      <Faq />
      <Footer />
    </div>
  );
};

const Faq = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <>
      {/* Top banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface-container-lowest py-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-tertiary-fixed/40 blur-3xl pointer-events-none"></div>
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-md mb-4 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">
                support_agent
              </span>
              <span>Help Center &amp; Support Hub</span>
            </div>
            <h1 className="text-headline-lg-mobile md:text-display-hero text-on-surface tracking-tight mb-2">
              Frequently Asked{" "}
              <span className="text-primary underline decoration-primary/30 decoration-wavy decoration-2">
                Questions
              </span>
            </h1>
            <p className="text-body-lg text-secondary max-w-xl mx-auto leading-relaxed">
              Quick answers to common questions about orders, shipping, returns,
              and payments on ShopNest.
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-10 w-full">
        <div className="flex flex-col gap-4 max-w-5xl mx-auto">
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                activeTab === item.id ? "shadow-md" : ""
              }`}
            >
              <button
                className="flex items-center justify-between w-full text-left group cursor-pointer focus:outline-none"
                onClick={() => toggleTab(item.id)}
              >
                <div className="flex items-center gap-4 min-w-0 pr-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105 ${
                      activeTab === item.id
                        ? "bg-primary-fixed text-primary"
                        : "bg-surface-container-low text-secondary group-hover:text-primary group-hover:bg-primary-fixed"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-label-sm uppercase tracking-wider font-bold block mb-0.5 ${
                        activeTab === item.id ? "text-primary" : "text-outline"
                      }`}
                    >
                      {item.category}
                    </span>
                    <h3 className="text-body-lg sm:text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {item.question}
                    </h3>
                  </div>
                </div>
                <div
                  className={`w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface shrink-0 transition-transform duration-300 ${
                    activeTab === item.id ? "rotate-180" : ""
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    expand_more
                  </span>
                </div>
              </button>
              {activeTab === item.id && (
                <div className="mt-4 bg-surface-container-low/40 rounded-xl p-4">
                  <p className="text-body-lg text-on-surface leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQPage;