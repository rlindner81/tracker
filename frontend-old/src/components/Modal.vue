<template>
  <div class="component modal">
    <div class="modal-background">
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "./../less/variables";

.component.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .modal-background {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);

    .modal-content {
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      margin: 0 auto;
      transform: translateY(-50%);
      background: @white;
      padding: 1.5rem;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }
  }
}
</style>
