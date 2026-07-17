from gradio_client import Client, handle_file

try:
    print('Connecting to vinthony/SadTalker...')
    client = Client('vinthony/SadTalker')
    print('Calling predict...')
    result = client.predict(
        source_image=handle_file('https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/source_image/full_body_1.png'),
        driven_audio=handle_file('https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/driven_audio/RD_Radio31_000.wav'),
        preprocess='crop',
        is_still_mode=True,
        enhancer='gfpgan',
        batch_size=1,
        size=256,
        pose_style=0,
        facerender='facevid2vid',
        exp_scale=1,
        use_ref_video=False,
        ref_info=None,
        ref_eyeblink=False,
        ref_pose=False,
        cp_info=None,
        use_idle_mode=False,
        length_of_audio=0,
        use_blink=True,
        api_name='/submit'
    )
    print('SUCCESS:', result)
except Exception as e:
    import traceback
    traceback.print_exc()

