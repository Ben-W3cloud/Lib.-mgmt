export default function Loading() {
  return (
    <div className="grid place-items-center py-32">
      <div className="preloader-panel">
        <span className="label-caps">[ Loading route ]</span>
        <span className="seg-bar seg-bar-animated" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
        </span>
      </div>
    </div>
  );
}
