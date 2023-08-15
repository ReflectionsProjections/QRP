<script lang="ts">
  import { Html5Qrcode } from "html5-qrcode";
  import { onMount } from "svelte";
  import { scannerActive } from "../stores";

  export let successCallback: Function;
  let scanning = false;
  let html5Qrcode: any;

  const init = () => {
    html5Qrcode = new Html5Qrcode("reader");
  };

  onMount(init);

  const onScanSuccess = (decodedText: string, decodedResult: string) => {
    console.log(`Code matched = ${decodedText}`);
    successCallback(decodedText);
  };

  const onScanFailure = (error: string) => {
    if (error.startsWith("QR code parse error, error = NotFoundException")) {
      // This error just means there is no QR code being detected.
      return;
    }
    console.warn(error);
  };

  const start = () => {
    html5Qrcode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 200, height: 200 },
      },
      onScanSuccess,
      onScanFailure
    );
    scanning = true;
  };

  const stop = async () => {
    if (html5Qrcode === undefined) {
      return;
    }
    await html5Qrcode.stop();
    scanning = false;
  };

  scannerActive.subscribe((active) => {
    if (active) {
      start();
    } else {
      stop();
    }
  });
</script>

<reader id="reader" class="w-full md:w-5/6 lg:w-1/2 min-h-[250px] bg-black" />
