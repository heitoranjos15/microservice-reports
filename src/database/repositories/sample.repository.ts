import { EntityRepository, Repository } from "typeorm";
import { Sample } from "../entities/sample.entity";

@EntityRepository(Sample)
export class SampleRepository extends Repository<Sample> {}
