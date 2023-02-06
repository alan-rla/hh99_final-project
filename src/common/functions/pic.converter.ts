import dotenv from 'dotenv';
dotenv.config();

export default function crowdLvlImg(crowdLvl: string) {
  if (crowdLvl === '여유') {
    return process.env.CROWD_LVL1;
  } else if (crowdLvl === '보통') {
    return process.env.CROWD_LVL2;
  } else if (crowdLvl === '약간 붐빔') {
    return process.env.CROWD_LVL3;
  } else {
    return process.env.CROWD_LVL4;
  }
}
