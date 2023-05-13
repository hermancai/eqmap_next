import { ReactNode, useMemo } from "react";
import { EarthquakeData } from "@/types/USGS";
import { useTable, useSortBy, usePagination, Column } from "react-table";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { SelectedRows } from "@/pages";

type DataTableProps = {
  entries: EarthquakeData[];
  selectedRows: SelectedRows;
  toggleSelectedRow: (id: EarthquakeData["id"]) => void;
};

type PaginationButtonProps = {
  children: ReactNode;
  condition: boolean;
  handleClick: Function;
};

const PaginationButton = ({
  children,
  condition,
  handleClick,
}: PaginationButtonProps) => {
  return (
    <button
      className={`${
        condition ? "hover:text-orange-400" : "text-slate-600"
      } text-white transition-[color] duration-200 ease-in`}
      onClick={() => handleClick()}
      disabled={!condition}
    >
      {children}
    </button>
  );
};

const DataTable = ({
  entries,
  selectedRows,
  toggleSelectedRow,
}: DataTableProps) => {
  const columns: Column[] = useMemo(() => {
    return [
      {
        Header: <p className="text-left">Location</p>,
        id: "location",
        accessor: "properties.place",
        disableSortBy: true,
        Cell: ({ value }) => <p className="text-left">{value || "N/A"}</p>,
      },
      {
        Header: (
          <>
            <p className="hidden sm:block text-right">Magnitude</p>
            <p className="block sm:hidden text-right">M</p>
          </>
        ),
        id: "magnitude",
        accessor: "properties.mag",
        sortType: "basic",
        sortDescFirst: true,
        Cell: ({ value }) => <p className="text-right">{value}</p>,
      },
      {
        Header: <p className="text-right">Date</p>,
        accessor: "properties.time",
        id: "date",
        sortType: "basic",
        Cell: ({ value }) => (
          <p className="text-right">
            {new Date(value).toLocaleTimeString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        ),
      },
    ];
  }, []);

  const data = useMemo(() => entries, [entries]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { sortBy: [{ id: "magnitude", desc: true }] },
      disableSortRemove: true,
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="bg-slate-100 overflow-x-auto text-sm sm:text-base py-10">
      <table
        {...getTableProps()}
        className="border-separate border-spacing-0 border border-slate-800 m-auto w-full md:w-[768px] table-fixed overflow-hidden md:rounded md:shadow-sm md:shadow-gray-500"
      >
        <caption className="md:text-left pb-2 md:px-4">
          Click on a row to highlight the event on the map.
        </caption>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumn } = column.getHeaderProps(
                    column.getSortByToggleProps({ title: undefined })
                  );
                  return (
                    <th
                      key={key}
                      {...restColumn}
                      className={`${
                        column.canSort ? "hover:text-orange-400" : ""
                      } p-2 sm:px-4 bg-slate-800 text-white transition-colors duration-200 ease-in font-normal ${
                        column.id === "location" ? "w-1/2" : ""
                      } ${column.id === "date" ? "w-[30%]" : ""}
                      `}
                    >
                      {column.id === "location" ? (
                        column.render("Header")
                      ) : (
                        <div className="flex flex-row flex-nowrap gap-2 justify-end items-center">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ChevronDownIcon className="h-5 sm:stroke-[2] text-orange-400" />
                            ) : (
                              <ChevronUpIcon className="h-5 sm:stroke-[2] text-orange-400" />
                            )
                          ) : null}
                          {column.render("Header")}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            // row.original has type {}
            // @ts-ignore
            const id = row.original.id;
            return (
              <tr
                key={key}
                {...restRowProps}
                onClick={() => {
                  toggleSelectedRow(id);
                }}
                className={`p-0 relative ease-in align-top ${
                  selectedRows[id]
                    ? "bg-green-200"
                    : "bg-white hover:bg-slate-200"
                }
                `}
              >
                {row.cells.map((cell) => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return (
                    <td
                      key={key}
                      {...restCellProps}
                      className="p-2 sm:px-4 border-b border-b-slate-300"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-slate-800 text-white">
          <tr>
            <td colSpan={3}>
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 p-2 sm:px-4">
                <div className="flex flex-row justify-center items-center gap-4">
                  <PaginationButton
                    condition={canPreviousPage}
                    handleClick={() => gotoPage(0)}
                  >
                    <ChevronDoubleLeftIcon className="h-5 sm:stroke-[2]" />
                  </PaginationButton>
                  <PaginationButton
                    condition={canPreviousPage}
                    handleClick={() => previousPage()}
                  >
                    <ChevronLeftIcon className="h-5 sm:stroke-[2]" />
                  </PaginationButton>
                  <p>
                    Page {pageIndex + 1} of {pageOptions.length}
                  </p>
                  <PaginationButton
                    condition={canNextPage}
                    handleClick={() => nextPage()}
                  >
                    <ChevronRightIcon className="h-5 sm:stroke-[2]" />
                  </PaginationButton>
                  <PaginationButton
                    condition={canNextPage}
                    handleClick={() => gotoPage(pageCount - 1)}
                  >
                    <ChevronDoubleRightIcon className="h-5 sm:stroke-[2]" />
                  </PaginationButton>
                </div>
                <select
                  className="cursor-pointer bg-slate-800 text-white hover:text-orange-400 transition-[color] duration-200 ease-in"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => {
                    return (
                      <option
                        key={pageSize}
                        value={pageSize}
                        className="text-white"
                      >
                        {pageSize} Rows
                      </option>
                    );
                  })}
                </select>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <div></div>
    </div>
  );
};

export default DataTable;
