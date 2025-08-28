import algosdk

# Ganti dengan 24 kata mnemonic kamu, dipisahkan oleh spasi.
words_24 = "member evoke unfair rail grocery state attend cloud gasp alpha panther shiver practice sustain gap wreck cat hurdle wish example lyrics recall tower embark"

# Tambahkan kode ini untuk memeriksa panjangnya
word_count = len(words_24.split())
print(f"Jumlah kata yang terdeteksi: {word_count}")

# Ubah 24 kata menjadi kunci privat.
private_key = algosdk.mnemonic.to_private_key(words_24)

# Ubah kunci privat kembali ke 25 kata mnemonic.
mnemonic_25 = algosdk.mnemonic.from_private_key(private_key)

print("25-word Mnemonic Phrase: " + mnemonic_25)