import {getWorkerById} from "../api/workerApi";
import ITalent from "../interfaces/talent";
import {getTalentById} from "../api/talentApi";

export async function getWorkerTalents(workerId: string) : Promise<Array<ITalent>> {
    // funkcia pre získanie workerovych talentov
    const worker = await getWorkerById(workerId);

    let workerTalents: Array<ITalent> = [];
    if (worker.talents) {
        for (const talentId of worker.talents) {
            await getTalentById(talentId).then((talent) => {
                workerTalents.push(talent);
            }).catch((e) => {
                console.log(e)
            });
        }
    }
    return workerTalents;
}