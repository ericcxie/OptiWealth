import React from "react";

export default function Footer() {
  return (
    <section>
      <div className="flex flex-row items-center justify-between px-4 space-x-28 py-4 border-t border-gray-600 md:px-14 md:py-8">
        <div className="flex flex-1">
          <div className="text-sm font-inter text-white">
            &copy; {new Date().getFullYear()} OptiWealth | Designed & Built with
            ☕️
          </div>
        </div>

        <ul className="flex">
          <li>
            <a
              href="https://github.com/ericcxie/OptiWealth"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
              aria-label="Github"
            >
              <svg
                className="w-8 h-8 fill-current"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
              </svg>
            </a>
          </li>
          {/* Add more social media icons as list items if needed */}
        </ul>
      </div>
    </section>
  );
}
