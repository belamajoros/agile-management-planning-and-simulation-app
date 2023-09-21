import ReactDOM, {render} from "react-dom";
import ProjectOverview from "./projectOverview";
import React from "react";
import IProject from "../../interfaces/project";
import {getProjectById} from "../../api/projectApi";
import any = jasmine.any;

export function SimulationComponent (){
    const [pickedProject, setPickedProject] = React.useState<IProject>( );

    const getDefaultProject = async () => {
        await getProjectById('').then((data) => {
            setPickedProject(data);
        }).catch((e) => {

            console.log(e);
        })
    }
    return (
        <div>

        </div>
    );



}