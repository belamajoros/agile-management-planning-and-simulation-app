import React from "react";

function AboutPage(){
    return (
        <div style={{border: "solid", borderRadius: 15, borderColor: "lightgray", margin: '5%'}}>
            <h1 style={{marginTop: '3%', textAlign: "center"}}>This is Agile app for agile development planning and simulation!</h1>

            <p style={{margin: '3% 35%', textAlign: "center"}}>
                This application serves for Simulation of the project cycle in SCRUM agile development planing method.
                You have an option to create your own project and It's corresponding tasks. To improve on simulation accuracy,
                you can create workers that are going to work on created project and give them talents that can affect work you assign them to.
            </p>
            <h2 style={{margin: '3%', textAlign: "center"}}>
                Enjoy your agile project simulation :)
            </h2>
        </div>
    );
}

export default AboutPage;