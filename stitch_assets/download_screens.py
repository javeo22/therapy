import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

screens = [
    {
        "name": "landing_page_desktop",
        "png": "https://lh3.googleusercontent.com/aida/ADBb0uiaj37G38LIJ_3BiMkI7gMUGMR0O4Hm2i7L1YNwJmTWuweEykQPKA6qhPltnGgcLTuSM_eh0ySf_Bpx2yU-vnxaSBtmn2jL4nqcWnixI_yRWWsbVOiNMNLScDyXhBagiivea21ejNuWPuk_DytI0IgTtmGt3RUik8KUBDds3pBxFNibt7sBayinu7xg8TGuf-liBBIQDekHEv8rn5v5XT5rZMMRs0ug5xcm_GN-pFFeTvZ1APjzY8vbVCMY",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAyMTYyZjNiMWNhNDQ5NmViZmU3MGZhODhhMTgxOGQ5EgsSBxCttIKj3xYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzQ5Mzg1ODgxMDgyMTI5MTkyMg&filename=&opi=89354086"
    },
    {
        "name": "therapist_home_mobile",
        "png": "https://lh3.googleusercontent.com/aida/ADBb0ug5K1zVqgSIB5LFVb0oa61Del6c5g9FjmKysAX8UdkZ-kTPSz9LeF_WdqOKv_AzmqbqBurQrG3YLCtq6ejHmrAMIbGd3Kmod4y9eDNhz2cnMBw4UyPfK15cr6A2pkWqcVQhqU7fef43_qrUxHGPmOMYqhp4DgytCsA8vK4d3q3vF43H6z1GYltYfKZkDcIBckT7Ga_XwftvSkHAmazPms5bHFQhPTrKJa6B0vOHvV0QezxcuybAoBUN4Inc",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzJjNjYwNjlmNGFjMzQyYmY4MjE4ZTUyYzY3ZWQ2MjM5EgsSBxCttIKj3xYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzQ5Mzg1ODgxMDgyMTI5MTkyMg&filename=&opi=89354086"
    },
    {
        "name": "login_screen_mobile",
        "png": "https://lh3.googleusercontent.com/aida/ADBb0uijfULaRfkOYUXQtrPpYvyJ-aeIfZsn7R3DcXpEdoyP9UWNJp3RzKmdod6v98AJ1WSW1EsvUS72XefJVGqXLLs0Aq43zPAhoSm5ppnjP0bk4Ws0nLbnPX-Y4UelGfgjaKdHZaMuwwshZsShPqbxAuaoL2Q0QyrmscFOtlMr_oi8lIdMjskF2MQZCFLJjkJ4vkd8ShuDRdExbLamF5XzzXDGbEWeE79C_lWl76lSkBqjuHPEkd3FfOxWWP6J",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2M5ZmFmMmJmMTE5MTQ4Mzk5ODczZjEwYWZlODljZDJjEgsSBxCttIKj3xYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzQ5Mzg1ODgxMDgyMTI5MTkyMg&filename=&opi=89354086"
    },
    {
        "name": "patient_record_mobile",
        "png": "https://lh3.googleusercontent.com/aida/ADBb0ugfrEL1CEGdwOzyf947EAaiX_Qb0HMFrQ1ZZSoKLbOrHzx22LRxxOwk8i66ElB45n_L1VZMsB6RSZZSH8WH4yLfP_gYA6Ji6jR1aOZ4fNL5XPQjgdv06088YoPQjEqg3jbkIvfTLlOsz0T63XwMPJAJSXoffSeVbThTcEVymteHwsSBv4vt02ihDcYCauK8o5wxrcq2XBtxpholeitMWotVWZd9AnGGuUoq2S70K9rNvkOT-V5V8xbluXBv",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAxNTMxMTI4MDVjMjQ5MGFhYTYyMDgxZjFhNGE2MDJmEgsSBxCttIKj3xYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzQ5Mzg1ODgxMDgyMTI5MTkyMg&filename=&opi=89354086"
    },
    {
        "name": "autorregistro_mobile",
        "png": "https://lh3.googleusercontent.com/aida/ADBb0ujAKPFW2SDiXbbliuG0EerfN_hHZO4mMcLOzywpyF1TrkJahCRzhxFy9nvJUg5bEwDF84BYlNjQZk9I9ECgqT8LlpTS230vZiJF-FQV5TI4NlaNFLXUYXj-GuyPpphdZDwy3SbkEjY4Ajyas2-NsJNt_nQCLKUgjdpCdp93Jtgwf8PvA6qWsil8muyDhHUHXMRBAvnVvy1dnt3a6GT8pju-rdAPdoC5hxZT0_E8kp4_BMY0LfVgpmxqPm8",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzJlZDE1MDgxOWMwZTQ0ZDY5YmIwNWQyNzNhYjZkOTFiEgsSBxCttIKj3xYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzQ5Mzg1ODgxMDgyMTI5MTkyMg&filename=&opi=89354086"
    },
    {
        "name": "patient_dashboard_mobile",
        "png": "https://lh3.googleusercontent.com/aida/ADBb0ugSdiyQk8NUdkBZlA1FPH57CJC5g-y_0zexArqXst9zPYNG4Q76__bV4qS6enyGFHTBSKBCTAYSK-nJzbjUfBbYKDSCndSqYBrCoCbQMrLazrcpdJfTK23kgI71HR0Wz4TdGE_x6C6Oaz2BxJJ_t7K7s1-Q-uw7Y_7b6ICAcYoevXaSsYa_8az8zOahWP98ML_KzQNLy4FsEMAGnh_flMLTnhTEAANc6P6bSgwtxGz_FbtORsSGEeo_ijok",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzljNDUwZmU3ZmFiOTQ2NGY4ZWJkZGYwMDM4ZDhjZmIxEgsSBxCttIKj3xYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzQ5Mzg1ODgxMDgyMTI5MTkyMg&filename=&opi=89354086"
    },
    {
        "name": "premium_landing_page_desktop",
        "png": "https://lh3.googleusercontent.com/aida/ADBb0uiop3sWZZqNjj9OLxnv4eSzw303e-7eLZkZeQvRX8972qd_i8ryG2Z1BVOqwGqD4IOosJ0ZpIG5hMP4bwD4xknJSd-I1AZqhlmDbca3zg164aJRjN41VsYICN9mr5EXfGxnmbBUN6fp-rxpl6b443lj3nC6C_6Mg1RFpwnNrwc7cn1Le1Nbdxiuzm9EEYHXps2ghORLIYXHxNAybw6B2gsy8cclDYtxb9wksVodmJ8zGst640INsudNVno",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2RiY2NiZDdhYTQ2MTRjOTdiMzI3NWY5MjRjOWRmMTU1EgsSBxCttIKj3xYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMzQ5Mzg1ODgxMDgyMTI5MTkyMg&filename=&opi=89354086"
    }
]

os.makedirs('stitch_assets/screens', exist_ok=True)
for screen in screens:
    name = screen['name']
    png_path = f"stitch_assets/screens/{name}.png"
    html_path = f"stitch_assets/screens/{name}.html"
    
    print(f"Downloading {name}...")
    try:
        urllib.request.urlretrieve(screen['png'], png_path)
        urllib.request.urlretrieve(screen['html'], html_path)
        print(f"Success: {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
