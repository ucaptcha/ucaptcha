mod utils;

use wasm_bindgen::prelude::*;
use malachite_nz::natural::Natural;
use malachite_base::num::conversion::traits::ToStringBase;
use malachite_base::num::arithmetic::traits::PowerOf2;
use malachite_base::num::arithmetic::traits::ModPowAssign;
use core::str::FromStr;

#[wasm_bindgen]
pub fn compute_vdf(g_str: &str, n_str: &str, t: u64) -> String {
    let mut g = Natural::from_str(g_str).expect("Invalid 'g'");
    let n = Natural::from_str(n_str).expect("Invalid 'N'");

    let pow = Natural::power_of_2(t);
    g.mod_pow_assign(pow, n);

    return g.to_string_base(10);
}
