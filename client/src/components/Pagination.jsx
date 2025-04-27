import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({ transaction }) => {
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);


  const lastIndexItem = currentPage * itemsPerPage;
  const firstIndexItem = lastIndexItem - itemsPerPage;
  const currentItems = transaction.slice(firstIndexItem, lastIndexItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((item, index) => (
          <div key={index} className="flex flex-col justify-center items-center">
            {item.element}
            <span className="text-sm text-black mt-2">Element No: {item.elementNo}</span>
          </div>
        ))}
      </div>

      <Pagination className="mt-8">
        <PaginationContent className="flex items-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrevious}
              className="text-gray-700 hover:text-blue-700 cursor-pointer"
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
                className={`text-gray-700 hover:text-blue-500 cursor-pointer ${
                  currentPage === index + 1 ? "font-bold text-blue-700" : ""
                }`}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className="text-gray-700 hover:text-blue-700 cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
