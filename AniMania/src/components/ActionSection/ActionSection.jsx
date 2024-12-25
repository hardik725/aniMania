import React from 'react';
import ActionList from '../ActionList/ActionList';
import UpdatedActionList from '../UpdatedActionList/UpdatedActionList'
import { useState , useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ActionSection({genre}) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust breakpoint as needed
    const location = useLocation();
    const isRecommended = (location.pathname === "/home");
    const roman = (location.pathname === "/seasonalmanga");

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);

    return (
<div className={`relative container mx-auto bg-transparent text-center ${isMobile ? "px-[1px]" : "px-[5px]"}`}>
    <div className="bg-transparent text-white text-start p-5">

                <h1 className="text-xl font-bold">{isRecommended ? "Recommended" : `${genre}`} Manga</h1>
                <div className="border-t border-gray-600 mb-4"></div> {/* Thin line with bottom margin */}
                {roman ? 
                <UpdatedActionList genre={genre}/>
                :
                <ActionList genre={genre}/>
                }
            </div>
        </div>
    );
}

export default ActionSection;
