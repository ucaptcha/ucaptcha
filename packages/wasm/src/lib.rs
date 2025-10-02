mod utils;

use wasm_bindgen::prelude::*;
use malachite_base::num::arithmetic::traits::ModMulAssign;
use malachite_nz::natural::Natural;
use malachite_base::num::conversion::traits::ToStringBase;
use core::str::FromStr;

#[wasm_bindgen]
pub fn compute_vdf(g_str: &str, n_str: &str, t: u64) -> String {
    let mut result = Natural::from_str(g_str).expect("Invalid 'g'");
    let n = Natural::from_str(n_str).expect("Invalid 'N'");

    for _ in 0..t {
        result.mod_mul_assign(result.clone(), n.clone());
    }

    result.to_string_base(10)
}
