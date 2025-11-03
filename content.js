// Content script for Deezer volume scroll extension

function getPopover(volumeButton) {
	const popoverId = volumeButton?.getAttribute("aria-controls");
	return popoverId ? document.getElementById(popoverId) : null;
}

function findVolumeElement() {
	const volumeButton = document.querySelector(
		'[data-testid="volume_button_default"]',
	);
	const popover = getPopover(volumeButton);
	return popover?.querySelector('input[type="range"]') || null;
}

function calculateNewVolume(currentValue, max, min, direction) {
	const factor = 1.1;
	const currentRatio = Math.max(0.001, currentValue / max);
	const newRatio =
		currentRatio < 0.1
			? currentRatio + 0.01 * direction
			: direction > 0
				? currentRatio * factor
				: currentRatio / factor;

	return Math.max(min, Math.min(max, newRatio * max));
}

function adjustVolumeOnElement(element, delta) {
	if (element?.type !== "range") return;

	const currentValue = parseFloat(element.value);
	const max = parseFloat(element.max) || 100;
	const min = parseFloat(element.min) || 0;
	const direction = delta > 0 ? 1 : -1;

	element.value = calculateNewVolume(currentValue, max, min, direction);
	element.dispatchEvent(new Event("input", { bubbles: true }));
}

function adjustVolume(delta) {
	const volumeElement = findVolumeElement();
	if (volumeElement) {
		adjustVolumeOnElement(volumeElement, delta);
	}
}

function isPopoverOpen(volumeButton) {
	const popover = getPopover(volumeButton);
	return popover && popover.style.display !== "none" && !popover.hidden;
}

function openPopover(volumeButton) {
	volumeButton.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
}

function handleWheel(event) {
	const volumeButton = document.querySelector(
		'button[data-testid^="volume_button"]',
	);

	if (!volumeButton?.contains(event.target)) return;

	event.preventDefault();

	const delta = event.deltaY > 0 ? -1 : 1;

	if (!isPopoverOpen(volumeButton)) {
		openPopover(volumeButton);
		setTimeout(() => adjustVolume(delta), 200);

		return;
	}

	adjustVolume(delta);
}

function attachListener() {
	const volumeButton = document.querySelector(
		'button[data-testid^="volume_button"]',
	);

	if (volumeButton) {
		volumeButton.addEventListener("wheel", handleWheel, { passive: false });
		console.log("Attached wheel listener to volume button");

		return;
	}

	setTimeout(attachListener, 1000);
}

// Start attaching listener
setTimeout(attachListener, 2000);
