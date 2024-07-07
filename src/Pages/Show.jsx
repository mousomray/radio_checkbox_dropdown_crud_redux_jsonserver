import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom'; // Import Link
import { useDispatch } from 'react-redux'; // Import Dispatch
import { showcustomer, deletecustomer } from "../Reducers/apicall"; // Import Show and Delete Function 
import { useQuery } from '@tanstack/react-query' // Import for useQuery 
import Layout from '../Common/Layout'; // Import Layout
import Swal from 'sweetalert2'; // Import Sweet Alert 
import DetailsIcon from '@mui/icons-material/Details'; //Details Icon
import EditIcon from '@mui/icons-material/Edit'; // Edit Icon
import DeleteIcon from '@mui/icons-material/Delete'; // Delete Icon

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



const Show = () => {

    const dispatch = useDispatch()
    const [visiblerow, setVisiblerow] = useState(5);
    const [searchQuery, setSearchQuery] = useState(''); // For Search Customer

    // Get Customer For Use Query 
    const getCustomerdata = async () => {
        const response = await dispatch(showcustomer()) // Call Showcustomer function
        return response?.payload
    }

    // Use Query Area
    const { isLoading, isError, data: customerdata, error, refetch } = useQuery({
        queryKey: ['customer'],
        queryFn: getCustomerdata // This line of code work as same as useEffect()
    })


    // Make Handle For Delete (Start)
    const handleDelete = async (id) => {
        // For Sweet Alert
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Customer Details!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            await dispatch(deletecustomer(id));
            refetch()
            // After Deletation Message
            Swal.fire(
                'Deleted!',
                'Your Customer Details has been deleted',
                'success'
            );
        }
    }
    // Make Handle For Delete (End)

    // Handle For Search
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter products based on search query
    const filteredCustomer = Array.isArray(customerdata) && customerdata?.filter((customer) =>
        customer.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function For Loadmore
    const handleLoadMore = () => {
        setVisiblerow(prev => prev + 5);
    };


    // For Loading 
    if (isLoading) {
        return (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <h1>Loading...</h1>
            </div>
        )

    }

    // For Error
    if (isError) {
        return <h1>{error.message}</h1>
    }

    return (
        <>
            <Layout>

                <input
                    type="text"
                    placeholder="Search customer..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ marginTop: '100px', width: '100%', padding: '10px', borderRadius: '30px' }}
                />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, marginTop: '10px' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Full Name</StyledTableCell>
                                <StyledTableCell align="center">Email</StyledTableCell>
                                <StyledTableCell align="center">Package</StyledTableCell>
                                <StyledTableCell align="center">Arrival Date</StyledTableCell>
                                <StyledTableCell align="center">Number of persons</StyledTableCell>
                                <StyledTableCell align="center">Avail</StyledTableCell>
                                <StyledTableCell align="center">Discount coupon code</StyledTableCell>
                                <StyledTableCell align="center">Terms and Condition</StyledTableCell>
                                <StyledTableCell align="center">Edit</StyledTableCell>
                                <StyledTableCell align="center">Delete</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(filteredCustomer) && filteredCustomer.slice(0, filteredCustomer.length).reverse().slice(0, visiblerow).map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.fullname}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                                    <StyledTableCell align="center">{row.package}</StyledTableCell>
                                    <StyledTableCell align="center">

                                        {row &&
                                            new Date(row.arrivaldate).toLocaleString('en-US', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}

                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.numberofperson}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {Array.isArray(row.avail) ? row.avail.join(', ') : row.avail}
                                    </StyledTableCell>

                                    <StyledTableCell align="center">{row.coupon}</StyledTableCell>

                                    <StyledTableCell align="center">{row.terms}</StyledTableCell>

                                    <StyledTableCell align="center"><Link to={`/edit/${row.id}`}><button className='btn-success'><EditIcon /></button></Link></StyledTableCell>
                                    <StyledTableCell align="center"><button onClick={() => handleDelete(row.id)} className='btn-danger'><DeleteIcon /></button></StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {visiblerow < filteredCustomer.length ? (
                        <div className="text-center mt-3 mb-3 mx-auto">
                            <button className="btn btn-primary" onClick={handleLoadMore}>Load More</button>
                        </div>
                    ) : null}
                </TableContainer>

            </Layout>
        </>
    )
}

export default Show
