<template>
    <view class="header">
        <text class="title"> {{ title }} </text>
    </view>
</template>

<script>
export default {
    props : ['title']
}
</script>

<style>
    .header {
        height: 60px;
        background-color: #171717;
        justify-content: center;
        align-items: center;
        width : 100%;
    }

    .title {
        color: whitesmoke;
        font-size: 28px;
        font-weight: bold;
        text-transform: uppercase;
    }
</style>