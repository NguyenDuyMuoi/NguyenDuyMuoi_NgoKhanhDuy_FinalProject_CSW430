cmake_minimum_required(VERSION 3.13)

set(CMAKE_VERBOSE_MAKEFILE on)
set(REACTNATIVE_MERGED_SO true)

# === FIX: định nghĩa NODE_MODULES_DIR ===
set(NODE_MODULES_DIR ${CMAKE_SOURCE_DIR}/../../../../node_modules)

# === Autolinking các native modules ===

add_subdirectory(
    ${NODE_MODULES_DIR}/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni
    rnasyncstorage_autolinked_build
)

add_subdirectory(
    ${NODE_MODULES_DIR}/react-native-safe-area-context/android/src/main/jni
    safeareacontext_autolinked_build
)

add_subdirectory(
    ${NODE_MODULES_DIR}/react-native-screens/android/src/main/jni
    rnscreens_autolinked_build
)

add_subdirectory(
    ${NODE_MODULES_DIR}/react-native-vector-icons/android/build/generated/source/codegen/jni
    RNVectorIconsSpec_autolinked_build
)

# === Danh sách thư viện để link ===
set(AUTOLINKED_LIBRARIES
    react_codegen_rnasyncstorage
    react_codegen_safeareacontext
    react_codegen_rnscreens
    react_codegen_RNVectorIconsSpec
)
