use std::convert::TryInto;

pub fn get_slot_iter<'a>(data: &'a [u8]) -> impl Iterator<Item = (u64, &'a [u8])> + 'a {
    let len: usize = u64::from_le_bytes(data[0..8].try_into().unwrap())
        .try_into()
        .unwrap();
    let iter = data[8..]
        .chunks_exact(40)
        .map(|chunk| 
            (
                u64::from_le_bytes(chunk[0..8].try_into().unwrap()),
                &chunk[8..40],
            )
        )
        .enumerate()
        .filter(move |e| e.0 < len)
        .map(|e| e.1);
    iter
}
