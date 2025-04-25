import React, { useContext, useMemo, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash,
  X,
} from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { categoryColors } from "@/lib/categories.js";
import { Input } from "./ui/input";
import ConfirmDelete from "@/modals/ConfirmDelete";

const TransactionTable = ({ transactions }) => {
  const {
    formatDate,
    formatTime,
    currency,
    deleteTransaction,
  } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [reccuringFilter, setReccuringFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  // handle select to delete
  const [selectedIds, setSelectedIds] = useState([]);
  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === transactions.length) {
      setSelectedIds([]);
    } else {
      const allIds = transactions.map((t) => t._id);
      setSelectedIds(allIds);
    }
  };
  // Delete Transaction

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (transactionId) => {
    setSelectedIds(transactionId);
    setIsModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    await deleteTransaction(selectedIds);
    setIsModalOpen(false);
    setSelectedIds([]);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIds([]);
  };
  // filter and sorting algos
  const filterAndSortTransactions = useMemo(() => {
    let result = [...transactions];
    // searching algo
    if (searchTerm) {
      const searchLowerCase = searchTerm.toLowerCase();
      result = result.filter((transactions) =>
        transactions?.description?.toLowerCase().includes(searchLowerCase)
      );
    }

    // recurring filter
    if (reccuringFilter) {
      result = result.filter((transactions) => {
        if (reccuringFilter === "recurring") return transactions.isRecurring;
        else return !transactions.isRecurring;
      });
    }
    if (typeFilter) {
      result = result.filter((t) => t.transactionType === typeFilter);
    }

    // sort algo
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          break;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, reccuringFilter, sortConfig]);

  // clear filter
  const handleClearFilter = () => {
    setSearchTerm("");
    setReccuringFilter("");
    setTypeFilter("");
    setSelectedIds([]);
  };

  return (
    <>
      <div className="pb-4">
        <div className="w-full flex flex-col sm:flex-row sm:flex-wrap items-stretch gap-2">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1 sm:min-w-[250px]">
            <Search className="text-muted-foreground absolute top-2 left-2 w-5 h-5" />
            <Input
              className="pl-8"
              placeholder="Search Transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-[150px] ">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurring Filter */}
          <div className="w-full sm:w-[200px]">
            <Select value={reccuringFilter} onValueChange={setReccuringFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Transactions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">Recurring Only</SelectItem>
                <SelectItem value="non-recurring">
                  Non-recurring Only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delete Button */}
          {selectedIds.length > 0 && (
            <div className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto whitespace-nowrap cursor-pointer"
                variant="destructive"
                onClick={() => handleDelete(selectedIds)}
              >
                <Trash className="mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {/* Clear Filter Button */}
          {(selectedIds.length > 0 ||
            searchTerm ||
            typeFilter ||
            reccuringFilter) && (
            <div className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto cursor-pointer"
                variant="outline"
                onClick={handleClearFilter}
              >
                <X className="h-4 w-5 mr-1" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <section className="w-full h-full border border-gray-200 bg-gray-100/50 rounded-xl overflow-x-auto">
        {/* transaction table */}
        <Table className="min-w-[768px] w-full text-sm">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="w-[3%]">
                <Checkbox
                  className="border border-gray-400 cursor-pointer"
                  checked={
                    transactions.length > 0 &&
                    selectedIds.length === transactions.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead
                className="w-[18%] text-gray-500 font-normal"
                onClick={() => {
                  setSortConfig((prevConfig) => {
                    const newDirection =
                      prevConfig.field === "date" &&
                      prevConfig.direction === "asc"
                        ? "desc"
                        : "asc";
                    return { field: "date", direction: newDirection };
                  });
                }}
              >
                <div className="flex items-center gap-1  cursor-pointer">
                  Date & Time
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="w-[40%] text-gray-500 font-normal">
                Description
              </TableHead>
              <TableHead
                className="w-[12%] text-gray-500 font-normal cursor-pointer"
                onClick={() => {
                  setSortConfig((prevConfig) => {
                    const newDirection =
                      prevConfig.field === "category" &&
                      prevConfig.direction === "asc"
                        ? "desc"
                        : "asc";
                    return { field: "category", direction: newDirection };
                  });
                }}
              >
                <div className="flex items-center gap-1">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="w-[12%] text-right text-gray-500 font-normal cursor-pointer"
                onClick={() => {
                  setSortConfig((prevConfig) => {
                    const newDirection =
                      prevConfig.field === "amount" &&
                      prevConfig.direction === "asc"
                        ? "desc"
                        : "asc";
                    return { field: "amount", direction: newDirection };
                  });
                }}
              >
                <div className="flex items-center justify-end gap-1">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="w-[10%] text-gray-500 font-normal">
                Recurring
              </TableHead>
              <TableHead className="w-[5%]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-3 leading-relaxed"
                >
                  🧾 No transactions found.
                  <br />
                  Try adjusting your filters or add a new one!
                </TableCell>
              </TableRow>
            ) : (
              filterAndSortTransactions.map((transaction, index) => (
                <TableRow key={index} className=" hover:bg-gray-200">
                  <TableCell>
                    <Checkbox
                      className="border border-gray-400  cursor-pointer"
                      checked={selectedIds.includes(transaction._id)}
                      onCheckedChange={() => handleSelect(transaction._id)}
                    />
                  </TableCell>

                  <TableCell>
                    {formatDate(transaction?.createdAt)},{" "}
                    {formatTime(transaction?.createdAt)}
                  </TableCell>

                  <TableCell>{transaction?.description}</TableCell>

                  <TableCell className="capitalize">
                    <span
                      className={`px-2 py-1 text-white rounded`}
                      style={{
                        background: categoryColors[transaction?.category],
                      }}
                    >
                      {transaction?.category}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div
                      className={`flex items-center justify-end font-medium ${
                        transaction?.transactionType === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      <span className="mr-0.5">
                        {transaction?.transactionType === "EXPENSE" ? "-" : "+"}
                      </span>
                      {currency}
                      {transaction?.amount}
                    </div>
                  </TableCell>

                  <TableCell>
                    {transaction?.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="cursor-pointer capitalize gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700"
                            >
                              <RefreshCcw className="w-3 h-3" />
                              {transaction?.recurringInterval?.toLowerCase()}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <div>Next Date :</div>
                              <div>
                                {formatDate(transaction?.nextRecurringDate)}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 cursor-pointer border-gray-300 bg-gray-100 "
                      >
                        <Clock className="w-3 h-3" /> One-time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right ">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="p-0 w-fit h-fit cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className="cursor-pointer">
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive cursor-pointer">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TransactionTable;
