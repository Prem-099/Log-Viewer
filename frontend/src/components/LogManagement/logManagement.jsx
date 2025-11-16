import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NavBar from "../Navbar";

const LogManager = ()=>{
    return (
        <>
            <NavBar/>
            <h4>Export logs : </h4>
            <select name="" id="">
                <option value="def">Export Logs</option>
                <option value="csv">Csv</option>
                <option value="excel">Excel</option>
            </select>

            <h4>Delete Logs : </h4>
            <select name="" id="">
                <option value="def">Delete Logs</option>
                <option value="1hr">Last 1 hour</option>
                <option value="1d">Last 1 day</option>
                <option value="1week">Last 1 week</option>
                <option value="50">Last 50 logs</option>
                <option value="100">Last 100 logs</option>
                <option value="all">Every log</option>
            </select>
            <h4>No.of logs to delete: </h4>
            <input type="text" placeholder="Custom value"/>
            <h4 style={{color: "grey"}}>Auto Cleaning</h4>
            <p style={{color: "grey"}}>Logs will be deleted every day </p>
            

        </>
    )
};

export default LogManager;