export declare class CreatePipelineDto {
    name: string;
}
export declare class CreateStageDto {
    pipelineId: string;
    name: string;
    order?: number;
    color?: string;
}
