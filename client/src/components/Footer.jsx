import { assets, footerLinks } from "../assets/assets";

const Footer = () => {

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-blue-100">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <span className='uppercase text-4xl font-bold bg-gradient-to-r from-[#646cff] to-[#af5cf7] bg-clip-text text-transparent'>f</span><span className='text-2xl font-bold bg-gradient-to-r from-[#646cff] to-[#af5cf7] bg-clip-text text-transparent'>rame</span><span className='uppercase text-4xl font-bold bg-gradient-to-r from-[#535bf4] to-[#af5cf7] bg-clip-text text-transparent'>F</span><span className='text-2xl font-bold bg-gradient-to-r from-[#646cff] to-[#af5cf7] bg-clip-text text-transparent'>orge</span>
                    <p className="max-w-[410px] mt-6 text-black">
                        We bring the best games and gear right to your screen. Trusted by thousands of players, we’re here to make your gaming experience seamless, exciting, and affordable.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1 text-black">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-black">
                Copyright {new Date().getFullYear()} © FrameForge All Right Reserved.
            </p>
        </div>
    );
};

export default Footer