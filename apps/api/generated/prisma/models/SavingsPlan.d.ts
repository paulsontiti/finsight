import type * as runtime from "@prisma/client/runtime/library";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model SavingsPlan
 *
 */
export type SavingsPlanModel = runtime.Types.Result.DefaultSelection<Prisma.$SavingsPlanPayload>;
export type AggregateSavingsPlan = {
    _count: SavingsPlanCountAggregateOutputType | null;
    _avg: SavingsPlanAvgAggregateOutputType | null;
    _sum: SavingsPlanSumAggregateOutputType | null;
    _min: SavingsPlanMinAggregateOutputType | null;
    _max: SavingsPlanMaxAggregateOutputType | null;
};
export type SavingsPlanAvgAggregateOutputType = {
    targetAmount: number | null;
    currentAmount: number | null;
};
export type SavingsPlanSumAggregateOutputType = {
    targetAmount: number | null;
    currentAmount: number | null;
};
export type SavingsPlanMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    targetAmount: number | null;
    currentAmount: number | null;
    status: $Enums.SavingsStatus | null;
    createdAt: Date | null;
};
export type SavingsPlanMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    targetAmount: number | null;
    currentAmount: number | null;
    status: $Enums.SavingsStatus | null;
    createdAt: Date | null;
};
export type SavingsPlanCountAggregateOutputType = {
    id: number;
    userId: number;
    targetAmount: number;
    currentAmount: number;
    status: number;
    createdAt: number;
    _all: number;
};
export type SavingsPlanAvgAggregateInputType = {
    targetAmount?: true;
    currentAmount?: true;
};
export type SavingsPlanSumAggregateInputType = {
    targetAmount?: true;
    currentAmount?: true;
};
export type SavingsPlanMinAggregateInputType = {
    id?: true;
    userId?: true;
    targetAmount?: true;
    currentAmount?: true;
    status?: true;
    createdAt?: true;
};
export type SavingsPlanMaxAggregateInputType = {
    id?: true;
    userId?: true;
    targetAmount?: true;
    currentAmount?: true;
    status?: true;
    createdAt?: true;
};
export type SavingsPlanCountAggregateInputType = {
    id?: true;
    userId?: true;
    targetAmount?: true;
    currentAmount?: true;
    status?: true;
    createdAt?: true;
    _all?: true;
};
export type SavingsPlanAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SavingsPlan to aggregate.
     */
    where?: Prisma.SavingsPlanWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SavingsPlans to fetch.
     */
    orderBy?: Prisma.SavingsPlanOrderByWithRelationInput | Prisma.SavingsPlanOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.SavingsPlanWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SavingsPlans from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SavingsPlans.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SavingsPlans
    **/
    _count?: true | SavingsPlanCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: SavingsPlanAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: SavingsPlanSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SavingsPlanMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SavingsPlanMaxAggregateInputType;
};
export type GetSavingsPlanAggregateType<T extends SavingsPlanAggregateArgs> = {
    [P in keyof T & keyof AggregateSavingsPlan]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSavingsPlan[P]> : Prisma.GetScalarType<T[P], AggregateSavingsPlan[P]>;
};
export type SavingsPlanGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavingsPlanWhereInput;
    orderBy?: Prisma.SavingsPlanOrderByWithAggregationInput | Prisma.SavingsPlanOrderByWithAggregationInput[];
    by: Prisma.SavingsPlanScalarFieldEnum[] | Prisma.SavingsPlanScalarFieldEnum;
    having?: Prisma.SavingsPlanScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SavingsPlanCountAggregateInputType | true;
    _avg?: SavingsPlanAvgAggregateInputType;
    _sum?: SavingsPlanSumAggregateInputType;
    _min?: SavingsPlanMinAggregateInputType;
    _max?: SavingsPlanMaxAggregateInputType;
};
export type SavingsPlanGroupByOutputType = {
    id: string;
    userId: string;
    targetAmount: number;
    currentAmount: number;
    status: $Enums.SavingsStatus;
    createdAt: Date;
    _count: SavingsPlanCountAggregateOutputType | null;
    _avg: SavingsPlanAvgAggregateOutputType | null;
    _sum: SavingsPlanSumAggregateOutputType | null;
    _min: SavingsPlanMinAggregateOutputType | null;
    _max: SavingsPlanMaxAggregateOutputType | null;
};
type GetSavingsPlanGroupByPayload<T extends SavingsPlanGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SavingsPlanGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SavingsPlanGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SavingsPlanGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SavingsPlanGroupByOutputType[P]>;
}>>;
export type SavingsPlanWhereInput = {
    AND?: Prisma.SavingsPlanWhereInput | Prisma.SavingsPlanWhereInput[];
    OR?: Prisma.SavingsPlanWhereInput[];
    NOT?: Prisma.SavingsPlanWhereInput | Prisma.SavingsPlanWhereInput[];
    id?: Prisma.StringFilter<"SavingsPlan"> | string;
    userId?: Prisma.StringFilter<"SavingsPlan"> | string;
    targetAmount?: Prisma.IntFilter<"SavingsPlan"> | number;
    currentAmount?: Prisma.IntFilter<"SavingsPlan"> | number;
    status?: Prisma.EnumSavingsStatusFilter<"SavingsPlan"> | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFilter<"SavingsPlan"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type SavingsPlanOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetAmount?: Prisma.SortOrder;
    currentAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type SavingsPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SavingsPlanWhereInput | Prisma.SavingsPlanWhereInput[];
    OR?: Prisma.SavingsPlanWhereInput[];
    NOT?: Prisma.SavingsPlanWhereInput | Prisma.SavingsPlanWhereInput[];
    userId?: Prisma.StringFilter<"SavingsPlan"> | string;
    targetAmount?: Prisma.IntFilter<"SavingsPlan"> | number;
    currentAmount?: Prisma.IntFilter<"SavingsPlan"> | number;
    status?: Prisma.EnumSavingsStatusFilter<"SavingsPlan"> | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFilter<"SavingsPlan"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type SavingsPlanOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetAmount?: Prisma.SortOrder;
    currentAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SavingsPlanCountOrderByAggregateInput;
    _avg?: Prisma.SavingsPlanAvgOrderByAggregateInput;
    _max?: Prisma.SavingsPlanMaxOrderByAggregateInput;
    _min?: Prisma.SavingsPlanMinOrderByAggregateInput;
    _sum?: Prisma.SavingsPlanSumOrderByAggregateInput;
};
export type SavingsPlanScalarWhereWithAggregatesInput = {
    AND?: Prisma.SavingsPlanScalarWhereWithAggregatesInput | Prisma.SavingsPlanScalarWhereWithAggregatesInput[];
    OR?: Prisma.SavingsPlanScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SavingsPlanScalarWhereWithAggregatesInput | Prisma.SavingsPlanScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SavingsPlan"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"SavingsPlan"> | string;
    targetAmount?: Prisma.IntWithAggregatesFilter<"SavingsPlan"> | number;
    currentAmount?: Prisma.IntWithAggregatesFilter<"SavingsPlan"> | number;
    status?: Prisma.EnumSavingsStatusWithAggregatesFilter<"SavingsPlan"> | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SavingsPlan"> | Date | string;
};
export type SavingsPlanCreateInput = {
    id?: string;
    targetAmount: number;
    currentAmount?: number;
    status?: $Enums.SavingsStatus;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSavingsInput;
};
export type SavingsPlanUncheckedCreateInput = {
    id?: string;
    userId: string;
    targetAmount: number;
    currentAmount?: number;
    status?: $Enums.SavingsStatus;
    createdAt?: Date | string;
};
export type SavingsPlanUpdateInput = {
    targetAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    currentAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSavingsStatusFieldUpdateOperationsInput | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSavingsNestedInput;
};
export type SavingsPlanUncheckedUpdateInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    currentAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSavingsStatusFieldUpdateOperationsInput | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsPlanCreateManyInput = {
    id?: string;
    userId: string;
    targetAmount: number;
    currentAmount?: number;
    status?: $Enums.SavingsStatus;
    createdAt?: Date | string;
};
export type SavingsPlanUpdateManyMutationInput = {
    targetAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    currentAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSavingsStatusFieldUpdateOperationsInput | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsPlanUncheckedUpdateManyInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    currentAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSavingsStatusFieldUpdateOperationsInput | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsPlanListRelationFilter = {
    every?: Prisma.SavingsPlanWhereInput;
    some?: Prisma.SavingsPlanWhereInput;
    none?: Prisma.SavingsPlanWhereInput;
};
export type SavingsPlanOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SavingsPlanCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetAmount?: Prisma.SortOrder;
    currentAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavingsPlanAvgOrderByAggregateInput = {
    targetAmount?: Prisma.SortOrder;
    currentAmount?: Prisma.SortOrder;
};
export type SavingsPlanMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetAmount?: Prisma.SortOrder;
    currentAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavingsPlanMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetAmount?: Prisma.SortOrder;
    currentAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavingsPlanSumOrderByAggregateInput = {
    targetAmount?: Prisma.SortOrder;
    currentAmount?: Prisma.SortOrder;
};
export type SavingsPlanCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavingsPlanCreateWithoutUserInput, Prisma.SavingsPlanUncheckedCreateWithoutUserInput> | Prisma.SavingsPlanCreateWithoutUserInput[] | Prisma.SavingsPlanUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavingsPlanCreateOrConnectWithoutUserInput | Prisma.SavingsPlanCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavingsPlanCreateManyUserInputEnvelope;
    connect?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
};
export type SavingsPlanUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavingsPlanCreateWithoutUserInput, Prisma.SavingsPlanUncheckedCreateWithoutUserInput> | Prisma.SavingsPlanCreateWithoutUserInput[] | Prisma.SavingsPlanUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavingsPlanCreateOrConnectWithoutUserInput | Prisma.SavingsPlanCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavingsPlanCreateManyUserInputEnvelope;
    connect?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
};
export type SavingsPlanUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavingsPlanCreateWithoutUserInput, Prisma.SavingsPlanUncheckedCreateWithoutUserInput> | Prisma.SavingsPlanCreateWithoutUserInput[] | Prisma.SavingsPlanUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavingsPlanCreateOrConnectWithoutUserInput | Prisma.SavingsPlanCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavingsPlanUpsertWithWhereUniqueWithoutUserInput | Prisma.SavingsPlanUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavingsPlanCreateManyUserInputEnvelope;
    set?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
    disconnect?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
    delete?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
    connect?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
    update?: Prisma.SavingsPlanUpdateWithWhereUniqueWithoutUserInput | Prisma.SavingsPlanUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavingsPlanUpdateManyWithWhereWithoutUserInput | Prisma.SavingsPlanUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavingsPlanScalarWhereInput | Prisma.SavingsPlanScalarWhereInput[];
};
export type SavingsPlanUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavingsPlanCreateWithoutUserInput, Prisma.SavingsPlanUncheckedCreateWithoutUserInput> | Prisma.SavingsPlanCreateWithoutUserInput[] | Prisma.SavingsPlanUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavingsPlanCreateOrConnectWithoutUserInput | Prisma.SavingsPlanCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavingsPlanUpsertWithWhereUniqueWithoutUserInput | Prisma.SavingsPlanUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavingsPlanCreateManyUserInputEnvelope;
    set?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
    disconnect?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
    delete?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
    connect?: Prisma.SavingsPlanWhereUniqueInput | Prisma.SavingsPlanWhereUniqueInput[];
    update?: Prisma.SavingsPlanUpdateWithWhereUniqueWithoutUserInput | Prisma.SavingsPlanUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavingsPlanUpdateManyWithWhereWithoutUserInput | Prisma.SavingsPlanUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavingsPlanScalarWhereInput | Prisma.SavingsPlanScalarWhereInput[];
};
export type EnumSavingsStatusFieldUpdateOperationsInput = {
    set?: $Enums.SavingsStatus;
};
export type SavingsPlanCreateWithoutUserInput = {
    id?: string;
    targetAmount: number;
    currentAmount?: number;
    status?: $Enums.SavingsStatus;
    createdAt?: Date | string;
};
export type SavingsPlanUncheckedCreateWithoutUserInput = {
    id?: string;
    targetAmount: number;
    currentAmount?: number;
    status?: $Enums.SavingsStatus;
    createdAt?: Date | string;
};
export type SavingsPlanCreateOrConnectWithoutUserInput = {
    where: Prisma.SavingsPlanWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavingsPlanCreateWithoutUserInput, Prisma.SavingsPlanUncheckedCreateWithoutUserInput>;
};
export type SavingsPlanCreateManyUserInputEnvelope = {
    data: Prisma.SavingsPlanCreateManyUserInput | Prisma.SavingsPlanCreateManyUserInput[];
};
export type SavingsPlanUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavingsPlanWhereUniqueInput;
    update: Prisma.XOR<Prisma.SavingsPlanUpdateWithoutUserInput, Prisma.SavingsPlanUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SavingsPlanCreateWithoutUserInput, Prisma.SavingsPlanUncheckedCreateWithoutUserInput>;
};
export type SavingsPlanUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavingsPlanWhereUniqueInput;
    data: Prisma.XOR<Prisma.SavingsPlanUpdateWithoutUserInput, Prisma.SavingsPlanUncheckedUpdateWithoutUserInput>;
};
export type SavingsPlanUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SavingsPlanScalarWhereInput;
    data: Prisma.XOR<Prisma.SavingsPlanUpdateManyMutationInput, Prisma.SavingsPlanUncheckedUpdateManyWithoutUserInput>;
};
export type SavingsPlanScalarWhereInput = {
    AND?: Prisma.SavingsPlanScalarWhereInput | Prisma.SavingsPlanScalarWhereInput[];
    OR?: Prisma.SavingsPlanScalarWhereInput[];
    NOT?: Prisma.SavingsPlanScalarWhereInput | Prisma.SavingsPlanScalarWhereInput[];
    id?: Prisma.StringFilter<"SavingsPlan"> | string;
    userId?: Prisma.StringFilter<"SavingsPlan"> | string;
    targetAmount?: Prisma.IntFilter<"SavingsPlan"> | number;
    currentAmount?: Prisma.IntFilter<"SavingsPlan"> | number;
    status?: Prisma.EnumSavingsStatusFilter<"SavingsPlan"> | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFilter<"SavingsPlan"> | Date | string;
};
export type SavingsPlanCreateManyUserInput = {
    id?: string;
    targetAmount: number;
    currentAmount?: number;
    status?: $Enums.SavingsStatus;
    createdAt?: Date | string;
};
export type SavingsPlanUpdateWithoutUserInput = {
    targetAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    currentAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSavingsStatusFieldUpdateOperationsInput | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsPlanUncheckedUpdateWithoutUserInput = {
    targetAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    currentAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSavingsStatusFieldUpdateOperationsInput | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsPlanUncheckedUpdateManyWithoutUserInput = {
    targetAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    currentAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSavingsStatusFieldUpdateOperationsInput | $Enums.SavingsStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsPlanSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    targetAmount?: boolean;
    currentAmount?: boolean;
    status?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savingsPlan"]>;
export type SavingsPlanSelectScalar = {
    id?: boolean;
    userId?: boolean;
    targetAmount?: boolean;
    currentAmount?: boolean;
    status?: boolean;
    createdAt?: boolean;
};
export type SavingsPlanOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "targetAmount" | "currentAmount" | "status" | "createdAt", ExtArgs["result"]["savingsPlan"]>;
export type SavingsPlanInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $SavingsPlanPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SavingsPlan";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        targetAmount: number;
        currentAmount: number;
        status: $Enums.SavingsStatus;
        createdAt: Date;
    }, ExtArgs["result"]["savingsPlan"]>;
    composites: {};
};
export type SavingsPlanGetPayload<S extends boolean | null | undefined | SavingsPlanDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload, S>;
export type SavingsPlanCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SavingsPlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SavingsPlanCountAggregateInputType | true;
};
export interface SavingsPlanDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SavingsPlan'];
        meta: {
            name: 'SavingsPlan';
        };
    };
    /**
     * Find zero or one SavingsPlan that matches the filter.
     * @param {SavingsPlanFindUniqueArgs} args - Arguments to find a SavingsPlan
     * @example
     * // Get one SavingsPlan
     * const savingsPlan = await prisma.savingsPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SavingsPlanFindUniqueArgs>(args: Prisma.SelectSubset<T, SavingsPlanFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SavingsPlanClient<runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one SavingsPlan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SavingsPlanFindUniqueOrThrowArgs} args - Arguments to find a SavingsPlan
     * @example
     * // Get one SavingsPlan
     * const savingsPlan = await prisma.savingsPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SavingsPlanFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SavingsPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavingsPlanClient<runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SavingsPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavingsPlanFindFirstArgs} args - Arguments to find a SavingsPlan
     * @example
     * // Get one SavingsPlan
     * const savingsPlan = await prisma.savingsPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SavingsPlanFindFirstArgs>(args?: Prisma.SelectSubset<T, SavingsPlanFindFirstArgs<ExtArgs>>): Prisma.Prisma__SavingsPlanClient<runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SavingsPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavingsPlanFindFirstOrThrowArgs} args - Arguments to find a SavingsPlan
     * @example
     * // Get one SavingsPlan
     * const savingsPlan = await prisma.savingsPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SavingsPlanFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SavingsPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavingsPlanClient<runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more SavingsPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavingsPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SavingsPlans
     * const savingsPlans = await prisma.savingsPlan.findMany()
     *
     * // Get first 10 SavingsPlans
     * const savingsPlans = await prisma.savingsPlan.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const savingsPlanWithIdOnly = await prisma.savingsPlan.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SavingsPlanFindManyArgs>(args?: Prisma.SelectSubset<T, SavingsPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a SavingsPlan.
     * @param {SavingsPlanCreateArgs} args - Arguments to create a SavingsPlan.
     * @example
     * // Create one SavingsPlan
     * const SavingsPlan = await prisma.savingsPlan.create({
     *   data: {
     *     // ... data to create a SavingsPlan
     *   }
     * })
     *
     */
    create<T extends SavingsPlanCreateArgs>(args: Prisma.SelectSubset<T, SavingsPlanCreateArgs<ExtArgs>>): Prisma.Prisma__SavingsPlanClient<runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many SavingsPlans.
     * @param {SavingsPlanCreateManyArgs} args - Arguments to create many SavingsPlans.
     * @example
     * // Create many SavingsPlans
     * const savingsPlan = await prisma.savingsPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SavingsPlanCreateManyArgs>(args?: Prisma.SelectSubset<T, SavingsPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a SavingsPlan.
     * @param {SavingsPlanDeleteArgs} args - Arguments to delete one SavingsPlan.
     * @example
     * // Delete one SavingsPlan
     * const SavingsPlan = await prisma.savingsPlan.delete({
     *   where: {
     *     // ... filter to delete one SavingsPlan
     *   }
     * })
     *
     */
    delete<T extends SavingsPlanDeleteArgs>(args: Prisma.SelectSubset<T, SavingsPlanDeleteArgs<ExtArgs>>): Prisma.Prisma__SavingsPlanClient<runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one SavingsPlan.
     * @param {SavingsPlanUpdateArgs} args - Arguments to update one SavingsPlan.
     * @example
     * // Update one SavingsPlan
     * const savingsPlan = await prisma.savingsPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SavingsPlanUpdateArgs>(args: Prisma.SelectSubset<T, SavingsPlanUpdateArgs<ExtArgs>>): Prisma.Prisma__SavingsPlanClient<runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more SavingsPlans.
     * @param {SavingsPlanDeleteManyArgs} args - Arguments to filter SavingsPlans to delete.
     * @example
     * // Delete a few SavingsPlans
     * const { count } = await prisma.savingsPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SavingsPlanDeleteManyArgs>(args?: Prisma.SelectSubset<T, SavingsPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more SavingsPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavingsPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SavingsPlans
     * const savingsPlan = await prisma.savingsPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SavingsPlanUpdateManyArgs>(args: Prisma.SelectSubset<T, SavingsPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one SavingsPlan.
     * @param {SavingsPlanUpsertArgs} args - Arguments to update or create a SavingsPlan.
     * @example
     * // Update or create a SavingsPlan
     * const savingsPlan = await prisma.savingsPlan.upsert({
     *   create: {
     *     // ... data to create a SavingsPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SavingsPlan we want to update
     *   }
     * })
     */
    upsert<T extends SavingsPlanUpsertArgs>(args: Prisma.SelectSubset<T, SavingsPlanUpsertArgs<ExtArgs>>): Prisma.Prisma__SavingsPlanClient<runtime.Types.Result.GetResult<Prisma.$SavingsPlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more SavingsPlans that matches the filter.
     * @param {SavingsPlanFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const savingsPlan = await prisma.savingsPlan.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.SavingsPlanFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a SavingsPlan.
     * @param {SavingsPlanAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const savingsPlan = await prisma.savingsPlan.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.SavingsPlanAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of SavingsPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavingsPlanCountArgs} args - Arguments to filter SavingsPlans to count.
     * @example
     * // Count the number of SavingsPlans
     * const count = await prisma.savingsPlan.count({
     *   where: {
     *     // ... the filter for the SavingsPlans we want to count
     *   }
     * })
    **/
    count<T extends SavingsPlanCountArgs>(args?: Prisma.Subset<T, SavingsPlanCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SavingsPlanCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a SavingsPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavingsPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SavingsPlanAggregateArgs>(args: Prisma.Subset<T, SavingsPlanAggregateArgs>): Prisma.PrismaPromise<GetSavingsPlanAggregateType<T>>;
    /**
     * Group by SavingsPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavingsPlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends SavingsPlanGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SavingsPlanGroupByArgs['orderBy'];
    } : {
        orderBy?: SavingsPlanGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SavingsPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavingsPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the SavingsPlan model
     */
    readonly fields: SavingsPlanFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for SavingsPlan.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__SavingsPlanClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the SavingsPlan model
 */
export interface SavingsPlanFieldRefs {
    readonly id: Prisma.FieldRef<"SavingsPlan", 'String'>;
    readonly userId: Prisma.FieldRef<"SavingsPlan", 'String'>;
    readonly targetAmount: Prisma.FieldRef<"SavingsPlan", 'Int'>;
    readonly currentAmount: Prisma.FieldRef<"SavingsPlan", 'Int'>;
    readonly status: Prisma.FieldRef<"SavingsPlan", 'SavingsStatus'>;
    readonly createdAt: Prisma.FieldRef<"SavingsPlan", 'DateTime'>;
}
/**
 * SavingsPlan findUnique
 */
export type SavingsPlanFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
    /**
     * Filter, which SavingsPlan to fetch.
     */
    where: Prisma.SavingsPlanWhereUniqueInput;
};
/**
 * SavingsPlan findUniqueOrThrow
 */
export type SavingsPlanFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
    /**
     * Filter, which SavingsPlan to fetch.
     */
    where: Prisma.SavingsPlanWhereUniqueInput;
};
/**
 * SavingsPlan findFirst
 */
export type SavingsPlanFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
    /**
     * Filter, which SavingsPlan to fetch.
     */
    where?: Prisma.SavingsPlanWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SavingsPlans to fetch.
     */
    orderBy?: Prisma.SavingsPlanOrderByWithRelationInput | Prisma.SavingsPlanOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SavingsPlans.
     */
    cursor?: Prisma.SavingsPlanWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SavingsPlans from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SavingsPlans.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SavingsPlans.
     */
    distinct?: Prisma.SavingsPlanScalarFieldEnum | Prisma.SavingsPlanScalarFieldEnum[];
};
/**
 * SavingsPlan findFirstOrThrow
 */
export type SavingsPlanFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
    /**
     * Filter, which SavingsPlan to fetch.
     */
    where?: Prisma.SavingsPlanWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SavingsPlans to fetch.
     */
    orderBy?: Prisma.SavingsPlanOrderByWithRelationInput | Prisma.SavingsPlanOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SavingsPlans.
     */
    cursor?: Prisma.SavingsPlanWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SavingsPlans from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SavingsPlans.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SavingsPlans.
     */
    distinct?: Prisma.SavingsPlanScalarFieldEnum | Prisma.SavingsPlanScalarFieldEnum[];
};
/**
 * SavingsPlan findMany
 */
export type SavingsPlanFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
    /**
     * Filter, which SavingsPlans to fetch.
     */
    where?: Prisma.SavingsPlanWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SavingsPlans to fetch.
     */
    orderBy?: Prisma.SavingsPlanOrderByWithRelationInput | Prisma.SavingsPlanOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SavingsPlans.
     */
    cursor?: Prisma.SavingsPlanWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SavingsPlans from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SavingsPlans.
     */
    skip?: number;
    distinct?: Prisma.SavingsPlanScalarFieldEnum | Prisma.SavingsPlanScalarFieldEnum[];
};
/**
 * SavingsPlan create
 */
export type SavingsPlanCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
    /**
     * The data needed to create a SavingsPlan.
     */
    data: Prisma.XOR<Prisma.SavingsPlanCreateInput, Prisma.SavingsPlanUncheckedCreateInput>;
};
/**
 * SavingsPlan createMany
 */
export type SavingsPlanCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many SavingsPlans.
     */
    data: Prisma.SavingsPlanCreateManyInput | Prisma.SavingsPlanCreateManyInput[];
};
/**
 * SavingsPlan update
 */
export type SavingsPlanUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
    /**
     * The data needed to update a SavingsPlan.
     */
    data: Prisma.XOR<Prisma.SavingsPlanUpdateInput, Prisma.SavingsPlanUncheckedUpdateInput>;
    /**
     * Choose, which SavingsPlan to update.
     */
    where: Prisma.SavingsPlanWhereUniqueInput;
};
/**
 * SavingsPlan updateMany
 */
export type SavingsPlanUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update SavingsPlans.
     */
    data: Prisma.XOR<Prisma.SavingsPlanUpdateManyMutationInput, Prisma.SavingsPlanUncheckedUpdateManyInput>;
    /**
     * Filter which SavingsPlans to update
     */
    where?: Prisma.SavingsPlanWhereInput;
    /**
     * Limit how many SavingsPlans to update.
     */
    limit?: number;
};
/**
 * SavingsPlan upsert
 */
export type SavingsPlanUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
    /**
     * The filter to search for the SavingsPlan to update in case it exists.
     */
    where: Prisma.SavingsPlanWhereUniqueInput;
    /**
     * In case the SavingsPlan found by the `where` argument doesn't exist, create a new SavingsPlan with this data.
     */
    create: Prisma.XOR<Prisma.SavingsPlanCreateInput, Prisma.SavingsPlanUncheckedCreateInput>;
    /**
     * In case the SavingsPlan was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.SavingsPlanUpdateInput, Prisma.SavingsPlanUncheckedUpdateInput>;
};
/**
 * SavingsPlan delete
 */
export type SavingsPlanDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
    /**
     * Filter which SavingsPlan to delete.
     */
    where: Prisma.SavingsPlanWhereUniqueInput;
};
/**
 * SavingsPlan deleteMany
 */
export type SavingsPlanDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SavingsPlans to delete
     */
    where?: Prisma.SavingsPlanWhereInput;
    /**
     * Limit how many SavingsPlans to delete.
     */
    limit?: number;
};
/**
 * SavingsPlan findRaw
 */
export type SavingsPlanFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: runtime.InputJsonValue;
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: runtime.InputJsonValue;
};
/**
 * SavingsPlan aggregateRaw
 */
export type SavingsPlanAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: runtime.InputJsonValue[];
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: runtime.InputJsonValue;
};
/**
 * SavingsPlan without action
 */
export type SavingsPlanDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavingsPlan
     */
    select?: Prisma.SavingsPlanSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SavingsPlan
     */
    omit?: Prisma.SavingsPlanOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SavingsPlanInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=SavingsPlan.d.ts.map