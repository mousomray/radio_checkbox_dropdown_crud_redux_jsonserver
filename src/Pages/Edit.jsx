import React from 'react'
import { useState } from 'react'
import './add.css'
import Layout from '../Common/Layout'
import { detailscustomer, editcustomer } from '../Reducers/apicall'
import { useQuery } from '@tanstack/react-query'
import { useForm } from "react-hook-form"; // Import React Hook Form 
import { useNavigate, useParams } from "react-router-dom"; // Import Use Navigate
import { useSelector, useDispatch } from "react-redux"; // Import Use Dispatch
import { CircularProgress } from "@mui/material"; // Circle Loader 


const Edit = () => {

    const { id } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // React Hook Form Area
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    
    const [term, setTerm] = useState(''); // For Radio Button Terms and Condition
    const [pak, setPak] = useState(''); // For Packages just like Goa, Puri
    const [avs, setAvs] = useState([]); // For Avail Fooding, Boarding or something checkbox


    // Get product For Single Value (Start)
    const getCustomer = async () => {
        try {
            const response = await dispatch(detailscustomer(id));

            const reg = {

                fullname: response?.payload?.fullname,
                email: response?.payload?.email,
                package: response?.payload?.package,
                arrivaldate: response?.payload?.arrivaldate,
                numberofperson: response?.payload?.numberofperson,
                avail: response?.payload?.avail,
                coupon: response?.payload?.coupon,
                terms: response?.payload?.terms
            };

            reset(reg)
            setTerm(response?.payload?.terms);
            setPak(response?.payload?.package);
            setAvs(response?.payload?.avail);

        } catch (error) {
            console.log(error);
        }
    };

    useQuery({ queryFn: getCustomer }) // This line of code work as same as useEffect()
    // Get product For Single Value (End)



    const onSubmit = async (data) => {
        setLoading(true);
        const reg = {
            fullname: data.fullname,
            email: data.email,
            package: pak,
            arrivaldate: data.arrivaldate,
            numberofperson: data.numberofperson,
            avail: avs,
            coupon: data.coupon,
            terms: term
        };
        try {
            const response = await dispatch(editcustomer({ data: reg, id }))
            console.log("Resss", response);
            if (response && response?.type === 'editcustomer/fulfilled') {
                navigate('/show')
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.error("Error submitting data:", error);

        }
    }


    // Handle For Check Box
    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setAvs([...avs, value]); // Add value to avs array if checked
        } else {
            setAvs(avs.filter(item => item !== value)); // Remove value from avs array if unchecked
        }
    };

    return (
        <>

            <Layout>

                <h1>Fill out this form</h1>
                <form onSubmit={handleSubmit(onSubmit)} method="post">

                    <label for="name">Full name*:</label><br />
                    <input type="text" id="fullname" name="fullname" placeholder="Enter your full name..." required

                        {...register("fullname", {
                            required: "This field is Required",
                            minLength: {
                                value: 3,
                                message: "Full name must be atleast 3 characters"
                            }
                        })}

                    />
                    {errors?.fullname && (
                        <p style={{ color: 'red' }}>{errors.fullname.message}</p>
                    )}
                    <br /><br />

                    <label for="email">Email address*:</label><br />
                    <input type="email" id="email" placeholder="Enter your valid email..." class="border" required

                        {...register("email", {
                            required: "This field is required",
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Email Pattern should be xyz@gmail.com",
                            },
                        })}

                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                    <br /><br />

                    <label for="tourpackage">Select tour package*:</label><br />
                    <select name="tourpackage" id="tourpackage" onChange={(e) => setPak(e.target.value)} value={pak} required>
                        <option value="No select package">No select package</option>
                        <option value="Goa">Goa</option>
                        <option value="Puri">Puri</option>
                        <option value="Digha">Digha</option>
                        <option value="Darjeeling">Darjelling</option>
                        <option value="Simla & Manali">Simla & Manali</option>
                        <option value="Kashmir">Kashmir</option>
                    </select>
                    <br /><br />

                    <label for="arrivaldate">Arrival Date*:</label><br />
                    <input type="date" id="arrivaldate" name="arrivaldate" placeholder="dd/mm/yyyy" class="border" required

                        {...register("arrivaldate", {
                            required: "This field is Required",
                        })}

                    />
                    {errors?.arrivaldate && (
                        <p style={{ color: 'red' }}>{errors.arrivaldate.message}</p>
                    )}
                    <br /><br />

                    <label for="persons">Number of persons*:</label><br />
                    <input type="number" id="persons" name="persons" class="border" placeholder="Enter number of person..." required

                        {...register("numberofperson", {
                            required: "This field is Required",
                        })}

                    />
                    {errors?.numberofperson && (
                        <p style={{ color: 'red' }}>{errors.numberofperson.message}</p>
                    )}
                    <br /><br />

                    <label>What would you want to avail?*</label><br />

                    <div onChange={handleCheckboxChange} value={avs} >
                        <label>
                            <input type="checkbox" value="Boarding" checked={Array.isArray(avs) && avs.includes("Boarding")} /> Boarding
                        </label><br />
                        <label>
                            <input type="checkbox" value="Fooding" checked={Array.isArray(avs) && avs.includes("Fooding")}/> Fooding
                        </label><br />
                        <label>
                            <input type="checkbox" value="Sight seeing" checked={Array.isArray(avs) && avs.includes("Sight seeing")}/> Sight seeing
                        </label><br />
                    </div>

                    <br /><br />

                    <label for="coupon">Discount coupon code:</label><br />
                    <input type="text" id="coupon" name="coupon" class="border" placeholder="Enter discount coupon code..."

                        {...register("coupon", {
                            required: "This field is Required",
                        })}

                    />
                    {errors?.coupon && (
                        <p style={{ color: 'red' }}>{errors.coupon.message}</p>
                    )}
                    <br /><br />

                    <label for="">Terms and conditions*</label><br />

                    <div onChange={(e) => setTerm(e.target.value)}>
                        <input type="radio" value="Agree" name="condition" checked={term === "Agree"} required />Agree
                        <input type="radio" value="Disagree" name="condition" checked={term === "Disagree"} required />Disagree
                    </div>
                    <br /><br /><br />
                    <button type="submit">Complete Reservation</button>
                </form>
            </Layout>
        </>
    )
}

export default Edit
