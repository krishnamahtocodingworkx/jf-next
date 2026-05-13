import { Supplier } from "@/interfaces/supplier";
import { createSlice } from "@reduxjs/toolkit";

export interface SupplierState {
    suppliers: Supplier[]
    loading: boolean
    error: string | null
}

const initialState: SupplierState = {
    suppliers: [],
    loading: false,
    error: null,
}
const supplierSlice = createSlice({
    name: "supplier",
    initialState: initialState,
    reducers: {},
})

export default supplierSlice.reducer;