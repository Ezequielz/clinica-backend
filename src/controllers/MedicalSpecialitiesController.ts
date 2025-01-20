import { Request, Response } from "express"


const getMedicalSpecialities = (req: Request, res: Response) => {
    res.json( 'getMedicalSpecialities' )
}


export const MedicalSpecialitiesController = {
    getMedicalSpecialities, 

}